DB_HOST = 'localhost'
DB_PORT = 5432
DB_NAME = 'brain'
DB_USER = 'brain'
DB_PASSWORD = 'brain'
SECRET = ('85eb9302d1e375305297971ce9ba9936564a0b0fa810f2e42eedf507a9ca692b40f8eda4eb6c08e828833f2d'
          'f7bf45bfb2645499bc2d131578a329a199727c61')
SQLALCHEMY_DATABASE_URI = (
    'postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}'
    .format(user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME))