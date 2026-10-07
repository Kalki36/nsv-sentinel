import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { LoadingState } from "./components/States";

const Overview = lazy(() => import("./pages/Overview"));
const MarketAnalytics = lazy(() => import("./pages/MarketAnalytics"));
const MarketSurveillance = lazy(() => import("./pages/MarketSurveillance"));
const SentimentIntelligence = lazy(() => import("./pages/SentimentIntelligence"));
const SecurityCenter = lazy(() => import("./pages/SecurityCenter"));
const AIDecisions = lazy(() => import("./pages/AIDecisions"));
const RiskAnalysis = lazy(() => import("./pages/RiskAnalysis"));
const Explainability = lazy(() => import("./pages/Explainability"));
const PairsTrading = lazy(() => import("./pages/PairsTrading"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Settings = lazy(() => import("./pages/Settings"));
const StockDetail = lazy(() => import("./pages/StockDetail"));

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/overview"
          element={
            <Suspense fallback={<LoadingState label="Loading Overview" />}>
              <Overview />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <Suspense fallback={<LoadingState label="Loading Market Analytics" />}>
              <MarketAnalytics />
            </Suspense>
          }
        />
        <Route
          path="/surveillance"
          element={
            <Suspense fallback={<LoadingState label="Loading Market Surveillance" />}>
              <MarketSurveillance />
            </Suspense>
          }
        />
        <Route
          path="/sentiment"
          element={
            <Suspense fallback={<LoadingState label="Loading Sentiment Intelligence" />}>
              <SentimentIntelligence />
            </Suspense>
          }
        />
        <Route
          path="/security"
          element={
            <Suspense fallback={<LoadingState label="Loading Security Center" />}>
              <SecurityCenter />
            </Suspense>
          }
        />
        <Route
          path="/ai-decisions"
          element={
            <Suspense fallback={<LoadingState label="Loading AI Decisions" />}>
              <AIDecisions />
            </Suspense>
          }
        />
        <Route
          path="/risk"
          element={
            <Suspense fallback={<LoadingState label="Loading Risk Analysis" />}>
              <RiskAnalysis />
            </Suspense>
          }
        />
        <Route
          path="/explainability"
          element={
            <Suspense fallback={<LoadingState label="Loading Explainability" />}>
              <Explainability />
            </Suspense>
          }
        />
        <Route
          path="/pairs-trading"
          element={
            <Suspense fallback={<LoadingState label="Loading Pairs Trading" />}>
              <PairsTrading />
            </Suspense>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <Suspense fallback={<LoadingState label="Loading Audit Logs" />}>
              <AuditLogs />
            </Suspense>
          }
        />
        <Route
          path="/faq"
          element={
            <Suspense fallback={<LoadingState label="Loading FAQ & AI Assistant" />}>
              <FAQ />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<LoadingState label="Loading Settings" />}>
              <Settings />
            </Suspense>
          }
        />
        <Route
          path="/stock/:symbol"
          element={
            <Suspense fallback={<LoadingState label="Loading stock detail" />}>
              <StockDetail />
            </Suspense>
          }
        />
      </Route>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
