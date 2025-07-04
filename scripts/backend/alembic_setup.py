"""
Script to set up Alembic for database migrations
Run this once to initialize Alembic in your project
"""

import subprocess
import os

def setup_alembic():
    print("Setting up Alembic for database migrations...")
    
    # Initialize Alembic
    subprocess.run(["alembic", "init", "alembic"], check=True)
    
    # Update alembic.ini to point to our database
    with open("alembic.ini", "r") as f:
        content = f.read()
    
    content = content.replace(
        "sqlalchemy.url = driver://user:pass@localhost/dbname",
        "sqlalchemy.url = sqlite:///./drug_database.db"
    )
    
    with open("alembic.ini", "w") as f:
        f.write(content)
    
    # Update env.py to import our models
    env_py_content = '''
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import sys
import os

# Add the parent directory to the path so we can import our models
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

from models import Base

config = context.config
fileConfig(config.config_file_name)
target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
'''
    
    with open("alembic/env.py", "w") as f:
        f.write(env_py_content)
    
    print("Alembic setup complete!")
    print("To create your first migration, run:")
    print("alembic revision --autogenerate -m 'Initial migration'")
    print("To apply migrations, run:")
    print("alembic upgrade head")

if __name__ == "__main__":
    setup_alembic()
