from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PairsTradingConfigSchema(BaseModel):
    nifty: str = "^NSEI"
    banknifty: str = "^NSEBANK"
    start_date: str = "2022-11-01"
    end_date: str = "2024-11-30"
    rolling_window: int = 120
    entry_z: float = 1.3
    exit_z: float = 0.4
    initial_capital: float = 1000000.0
    trade_scale: float = 45.0
    stop_loss_pct: float = 0.02
    transaction_cost: float = 0.002
    adf_significance: float = 0.05

class AdfTestResultSchema(BaseModel):
    adf_statistic: float
    p_value: float
    stationary: bool

class TradeRecordSchema(BaseModel):
    Entry_Time: str = Field(..., alias="Entry Time")
    Exit_Time: str = Field(..., alias="Exit Time")
    Side: str
    Entry_Spread: float = Field(..., alias="Entry Spread")
    Exit_Spread: float = Field(..., alias="Exit Spread")
    PnL: float
    Transaction_Cost: float = Field(..., alias="Transaction Cost")
    Exit_Reason: str = Field(..., alias="Exit Reason")

    class Config:
        populate_by_name = True

class PerformanceMetricsSchema(BaseModel):
    initial_capital: float = Field(..., alias="Initial Capital")
    final_capital: float = Field(..., alias="Final Capital")
    total_return_pct: float = Field(..., alias="Total Return (%)")
    cagr_pct: float = Field(..., alias="CAGR (%)")
    sharpe_ratio: float = Field(..., alias="Sharpe Ratio")
    max_drawdown_pct: float = Field(..., alias="Maximum Drawdown (%)")
    total_trades: int = Field(..., alias="Total Trades")
    winning_trades: int = Field(..., alias="Winning Trades")
    losing_trades: int = Field(..., alias="Losing Trades")
    win_rate_pct: float = Field(..., alias="Win Rate (%)")
    total_pnl: float = Field(..., alias="Total PnL")

    class Config:
        populate_by_name = True

class DecisionExplanationSchema(BaseModel):
    decision: str
    reason: str

class SeriesPointSchema(BaseModel):
    label: str
    nifty: float
    banknifty: float
    spread: float
    zscore: Optional[float] = None
    signal: int
    capital: float

class PairsTradingAnalysisResponse(BaseModel):
    current_zscore: float
    current_signal: int
    hedge_ratio: float
    intercept: float
    adf_test: AdfTestResultSchema
    performance: Dict[str, Any]
    decision: DecisionExplanationSchema
    data_integrity_hash: str
    series: List[SeriesPointSchema]
    trades: List[Dict[str, Any]]
