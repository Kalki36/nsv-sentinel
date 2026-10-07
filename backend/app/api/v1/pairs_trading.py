from fastapi import APIRouter, Depends, Query
from app.core.security import get_current_user
from app.schemas.pairs_trading import PairsTradingConfigSchema, PairsTradingAnalysisResponse
from app.services.pairs_trading_service import execute_pairs_trading_analysis

router = APIRouter(prefix="/pairs-trading", tags=["Pairs Trading Arbitrage"])

@router.get("/analysis", response_model=PairsTradingAnalysisResponse)
def get_pairs_trading_analysis(
    nifty: str = Query("^NSEI", description="NIFTY index ticker"),
    banknifty: str = Query("^NSEBANK", description="BANKNIFTY index ticker"),
    start_date: str = Query("2022-11-01", description="Start date (YYYY-MM-DD)"),
    end_date: str = Query("2024-11-30", description="End date (YYYY-MM-DD)"),
    rolling_window: int = Query(120, description="Rolling window size"),
    entry_z: float = Query(1.3, description="Z-score entry threshold"),
    exit_z: float = Query(0.4, description="Z-score exit threshold"),
    current_user: dict = Depends(get_current_user)
):
    """
    Executes NIFTY - BANKNIFTY statistical arbitrage quantitative pipeline
    with ADF cointegration test, rolling Z-score, trading signals, risk-managed backtest,
    and explainable AI analysis.
    """
    config = PairsTradingConfigSchema(
        nifty=nifty,
        banknifty=banknifty,
        start_date=start_date,
        end_date=end_date,
        rolling_window=rolling_window,
        entry_z=entry_z,
        exit_z=exit_z
    )
    return execute_pairs_trading_analysis(config)

@router.post("/run-backtest", response_model=PairsTradingAnalysisResponse)
def run_pairs_trading_backtest(
    config: PairsTradingConfigSchema,
    current_user: dict = Depends(get_current_user)
):
    """
    Runs custom statistical arbitrage backtest with configurable parameters
    (rolling window, entry/exit z-score, initial capital, stop loss %, transaction costs, trade scale).
    """
    return execute_pairs_trading_analysis(config)
