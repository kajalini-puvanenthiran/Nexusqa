import { C } from "../constants";
import { SectionTitle, CodeBlock } from "../components/UI";

const SAMPLES = [
    {
        title: "nexusqa_main.py — Full Antigravity Entrypoint", color: C.gold, code: `@ag.app(name="nexusqa", version="2.0.0")
class NexusQAApp:

    @ag.flow
    async def scan(self, url: str, config: ScanConfig = ScanConfig()) -> ScanReport:
        state = ScanState(target_url=url, config=config)
        state = await ClassifyAgent().run(state)
        state = await CrawlerAgent().run(state)

        results = await ag.parallel([
            UIAgent(state), APIAgent(state), SecurityAgent(state),
            PerformanceAgent(state), AccessibilityAgent(state),
            SEOAgent(state), DataQualityAgent(state), MobileAgent(state),
            AutoDebugAgent(state), CodeAnalyzerAgent(state),
        ])
        state.merge_results(results)
        state = await LLMAnalysisAgent().run(state)
        state = await AutoRepairOrchestrator().run(state)
        state = await JIRAAutomationAgent().batch_create(state.findings)
        return await ReportAgent().generate(state)

    @ag.schedule(cron="0 2 * * *")
    async def daily_regression(self):
        for url in await self.db.get_monitored_urls():
            report = await self.scan(url)
            if report.has_regressions:
                await self.notify(url, report)

    @ag.dashboard
    def control_panel(self):
        return ag.Dashboard(
            title="NEXUS QA Control Center",
            widgets=[
                ag.ScanWidget(flow=self.scan),
                ag.ReportViewer(editable=True),
                ag.JIRAStatusWidget(),
                ag.RealTimeLogWidget(),
            ]
        )` },
    {
        title: "universal_test_generator.py — Auto-generates test suites for ANY system", color: C.cyan, code: `class UniversalTestGenerator:
    async def generate_suite(self, url: str, system_type: str) -> TestSuite:
        site_map = await self.crawler.full_crawl(url)

        tests = await self.llm.generate(f"""
        You are a QA architect. Analyze this system:
        URL: {url}
        Type: {system_type}
        Pages: {[p.url for p in site_map.pages[:20]]}
        Forms: {site_map.forms}
        API endpoints: {site_map.api_calls}

        Generate JSON with:
        - ui_tests: list of Playwright test scenarios
        - api_tests: list of API test cases
        - security_checks: list of security validation checks
        - business_logic_tests: list of workflow tests
        - edge_cases: boundary/negative test cases
        Make tests specific to this system, not generic.
        """, format="json")

        playwright_code = await self.llm.generate(
            f"Convert to executable Python Playwright code:\\n{json.dumps(tests['ui_tests'])}"
        )

        return TestSuite(
            generated_for=url,
            playwright_tests=playwright_code,
            api_tests=tests['api_tests'],
            security_checks=tests['security_checks'],
            total_test_count=sum(len(v) for v in tests.values() if isinstance(v, list))
        )` },
];

export default function CodeSection() {
    return (
        <div>
            <SectionTitle icon="⬟" title="KEY CODE SAMPLES" sub="Production-ready Python implementations" color={C.cyan} />
            {SAMPLES.map(s => (
                <div key={s.title} style={{ marginBottom: 24 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: s.color, marginBottom: 4, fontWeight: 600 }}>// {s.title}</div>
                    <CodeBlock lang="python" color={s.color} code={s.code} />
                </div>
            ))}
        </div>
    );
}
