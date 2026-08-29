import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const UuidGenerator = lazy(() =>
  import('./pages/UuidGenerator').then((m) => ({ default: m.UuidGenerator })),
)
const Base64Tool = lazy(() => import('./pages/Base64Tool').then((m) => ({ default: m.Base64Tool })))
const JsonTool = lazy(() => import('./pages/JsonTool').then((m) => ({ default: m.JsonTool })))
const YamlTool = lazy(() => import('./pages/YamlTool').then((m) => ({ default: m.YamlTool })))
const HashGenerator = lazy(() =>
  import('./pages/HashGenerator').then((m) => ({ default: m.HashGenerator })),
)
const JwtDecoder = lazy(() => import('./pages/JwtDecoder').then((m) => ({ default: m.JwtDecoder })))
const CronBuilder = lazy(() => import('./pages/CronBuilder').then((m) => ({ default: m.CronBuilder })))
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/uuid-generator" element={<UuidGenerator />} />
        <Route path="/base64" element={<Base64Tool />} />
        <Route path="/json-formatter" element={<JsonTool initialMode="format" />} />
        <Route path="/json-validator" element={<JsonTool initialMode="validate" />} />
        <Route path="/json-diff" element={<JsonTool initialMode="diff" />} />
        <Route path="/yaml-validator" element={<YamlTool initialMode="validate" />} />
        <Route path="/yaml-to-json" element={<YamlTool initialMode="toJson" />} />
        <Route path="/hash-generator" element={<HashGenerator />} />
        <Route path="/jwt-decoder" element={<JwtDecoder />} />
        <Route path="/cron-builder" element={<CronBuilder />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
