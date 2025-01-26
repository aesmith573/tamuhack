from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import json
app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class UserFinances(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    income = db.Column(db.Integer, unique=True, nullable=False)
    savings = db.Column(db.Integer, unique=True, nullable=False)
    bills = db.Column(db.String(150), unique=True, nullable=False)
    goals = db.Column(db.String(200), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        if User.query.filter_by(email=email).first():
           flash('Email already exists.', 'danger')
           return redirect(url_for('login'))

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()
        flash('Account created successfully!', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            # current_user.id = user.id
            # current_user.username = user.username
            return redirect(url_for('profile'))
        else:
            flash('Invalid email or password.', 'danger')

    return render_template('login.html')

@login_required
@app.route('/logout')
def logout():
    logout_user()
    session.clear()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('login'))


@login_required
@app.route('/profile')
def profile():
    return render_template('profile.html', user=current_user.username)

def parse_dict_string(dict_string):
    if not dict_string or dict_string == "{}":
        return {}
    dict_string = dict_string.strip('{}')  # Remove curly braces
    items = dict_string.split(', ')  # Split into key-value pairs
    parsed_dict = {}
    for item in items:
        key, value = item.split(': ')  # Split key and value
        key = key.strip("'\"")  # Remove quotes around key
        value = value.strip("'\"")  # Remove quotes around value
        parsed_dict[key] = float(value) if value.replace('.', '', 1).isdigit() else value
    return parsed_dict

def dict_to_string(input_dict):
    if not input_dict:
        return "{}"
    items = [f"'{key}': {value}" for key, value in input_dict.items()]
    return "{" + ", ".join(items) + "}"

@app.route('/setbudget', methods=['GET', 'POST'])
def setBudget():

    current_user_fin = UserFinances.query.get(int(current_user.id))


    if request.method == 'POST':
        calculation = request.data.decode('utf-8')
        income = request.form['MonthIncome']
        savings = request.form['savings']
        numBills = request.form['NumBills']

        bills = {}
        totalB = 0
        totalS = 0
        for i in range(int(numBills)):
            bills[request.form[f'{i+1}BillName']] = request.form[f'{i+1}BillCost']
            totalB += float(bills[request.form[f'{i+1}BillName']])
        numGoals = request.form['numSavings']
        goals = {}
        percs = []
        for i in range(int(numGoals)):
            goals[request.form[f'{i + 1}saveName']] = request.form[f'{i + 1}saveCost']
            totalS += float(goals[request.form[f'{i + 1}saveName']])
            percs.append(float(goals[request.form[f'{i + 1}saveName']]))

        current_user.leftovers = float(income) - totalB - float(savings)

        for i in range(len(percs)):
            percs[i] /= totalS
            print(f"percentage{i}: {percs[i]}")

            print(current_user.leftovers)

            calculation += f"Allocate ${(current_user.leftovers * percs[i]):.2f} to {request.form[f'{i + 1}saveName']}\n"

        print(calculation)


        if current_user_fin:
            # Update existing entry
            current_user_fin.income = float(income)
            current_user_fin.savings = float(savings)
            current_user_fin.bills = dict_to_string(bills)
            current_user_fin.goals = dict_to_string(goals)
        else:
            # Create a new entry if none exists

            fin = UserFinances(id=current_user.id, income=float(income), savings=float(savings),
                               goals=dict_to_string(goals), bills=dict_to_string(bills))

            db.session.add(fin)
            current_user_fin = fin

        db.session.commit()

        return render_template(
            'askForm1.html',
            income = current_user_fin.income,
            savings = current_user_fin.savings,
            bills = parse_dict_string(current_user_fin.bills),
            goals = parse_dict_string(current_user_fin.goals),
            calculation=calculation,
            gif=True
        )


    if current_user_fin is not None:
        return render_template(
            'askForm1.html',
            income=current_user_fin.income,
            savings=current_user_fin.savings,
            bills= parse_dict_string(current_user_fin.bills),
            goals=parse_dict_string(current_user_fin.goals)
        )
    else:
        return render_template(
            'askForm1.html',
            income=0,
            savings=0,
            bills='',
            goals='parse_dict_string(current_user.goals)'
        )

if __name__ == '__main__':
    # db.create_all()
    app.run(debug=True)
