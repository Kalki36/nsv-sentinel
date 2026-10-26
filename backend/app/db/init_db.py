from app.core.database import Base, engine
from app.core.security import hash_password
from app.models import User, UserRole
from sqlalchemy.orm import Session
from app.core.logging import logger

def init_db(db: Session):
    Base.metadata.create_all(bind=engine)
    
    # Check if admin/analyst seed users exist
    admin_user = db.query(User).filter(User.email == "admin@nsv-sentinel.edu").first()
    if not admin_user:
        admin_user = User(
            email="admin@nsv-sentinel.edu",
            full_name="Administrator",
            password_hash=hash_password("Admin@Sentinel2026"),
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin_user)
    
    analyst_user = db.query(User).filter(User.email == "analyst@nsv-sentinel.edu").first()
    if not analyst_user:
        analyst_user = User(
            email="analyst@nsv-sentinel.edu",
            full_name="N. Sharma",
            password_hash=hash_password("Sentinel@2026"),
            role=UserRole.ANALYST,
            is_active=True
        )
        db.add(analyst_user)
        
    db.commit()
    logger.info("Database schema initialized and seed users created.")
