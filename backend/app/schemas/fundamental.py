from pydantic import BaseModel

class CompanyFundamentalSchema(BaseModel):
    symbol: str
    companyName: str
    healthScore: float  # 0 to 100
    healthRating: str   # Strong, Stable, Moderate, Caution
    netSales: float      # ₹ Cr
    cashEquivalents: float  # ₹ Cr
    pbdit: float         # Profit Before Depr, Int & Tax (₹ Cr)
    opMargin: float      # Operating Profit to Net Sales (%)
    pbtLessOi: float     # PBT Less Other Income (₹ Cr)
    pat: float           # Profit After Tax (₹ Cr)
    eps: float           # Earnings Per Share (₹)
