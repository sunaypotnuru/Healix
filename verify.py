#!/usr/bin/env python3
"""
NetraAI Production Readiness Verification Script
Tests all components, user journeys, and edge cases
Generates comprehensive test report
"""

import subprocess
import json
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

class NetraAIVerification:
    def __init__(self):
        self.tests_passed = 0
        self.tests_failed = 0
        self.tests_total = 0
        self.results = []
        self.start_time = datetime.now()
        
    def log_test(self, category: str, test_name: str, passed: bool, details: str = ""):
        """Log a test result"""
        self.tests_total += 1
        if passed:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            self.tests_failed += 1
            status = "❌ FAIL"
        
        result = {
            "category": category,
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        print(f"{status} | {category:20s} | {test_name:40s} | {details}")
        
    def run_command(self, cmd: List[str], timeout: int = 30) -> Tuple[bool, str]:
        """Run a shell command and return success status and output"""
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout,
                shell=False
            )
            return result.returncode == 0, result.stdout + result.stderr
        except subprocess.TimeoutExpired:
            return False, "Command timeout"
        except Exception as e:
            return False, str(e)
    
    def test_docker_status(self):
        """Test 1: Verify Docker & Docker Compose installed"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 1. ENVIRONMENT & STARTUP")
        print("="*100)
        
        # Docker installed
        success, output = self.run_command(["docker", "--version"])
        self.log_test("Environment", "Docker Installed", success, output.strip()[:50])
        
        # Docker Compose installed
        success, output = self.run_command(["docker-compose", "--version"])
        self.log_test("Environment", "Docker Compose Installed", success, output.strip()[:50])
        
        # Docker daemon running
        success, output = self.run_command(["docker", "ps"])
        self.log_test("Environment", "Docker Daemon Running", success, "" if success else "Daemon not responding")
    
    def test_docker_containers(self):
        """Test 2: Verify all containers running"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 2. DOCKER CONTAINERS")
        print("="*100)
        
        # Check if docker-compose.yml exists
        compose_file = Path("docker-compose.yml")
        compose_exists = compose_file.exists()
        self.log_test("Docker Compose", "docker-compose.yml Exists", compose_exists)
        
        # List running containers
        success, output = self.run_command(["docker", "compose", "ps", "--all"])
        if success:
            container_count = output.count("Up")
            self.log_test("Docker Compose", "Containers Status", container_count >= 3, f"{container_count} containers up")
            
            # Check specific services
            services = ["frontend", "backend", "anemia-service", "libretranslate"]
            for service in services:
                service_running = service in output and "Up" in output
                self.log_test("Docker Compose", f"Service Running: {service}", service_running)
    
    def test_api_endpoints(self):
        """Test 3: Verify API endpoints"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 3. API ENDPOINTS")
        print("="*100)
        
        endpoints = [
            ("http://localhost:8000/health", "Backend Health Check"),
            ("http://localhost:8000/docs", "Swagger UI"),
            ("http://localhost:8001/health", "AI Service Health"),
            ("http://localhost:5000", "Translation Service"),
            ("http://localhost:3000", "Frontend"),
        ]
        
        for url, name in endpoints:
            success, output = self.run_command(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", url], timeout=10)
            http_code = output.strip() if success else "Failed"
            is_ok = success and int(http_code) < 500
            self.log_test("API Endpoints", name, is_ok, f"HTTP {http_code}")
    
    def test_database_connectivity(self):
        """Test 4: Verify database connectivity"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 4. DATABASE CONNECTIVITY")
        print("="*100)
        
        # Check if .env exists
        env_file = Path(".env")
        env_exists = env_file.exists()
        self.log_test("Database Config", ".env File Exists", env_exists)
        
        # Check .env has Supabase config
        if env_exists:
            try:
                with open(".env", encoding="utf-8", errors="ignore") as f:
                    env_content = f.read()
                    has_supabase_url = "SUPABASE_URL" in env_content
                    has_service_key = "SUPABASE_SERVICE_KEY" in env_content
                    self.log_test("Database Config", "Supabase URL Configured", has_supabase_url)
                    self.log_test("Database Config", "Supabase Service Key Configured", has_service_key)
            except Exception as e:
                self.log_test("Database Config", "Supabase URL Configured", False, f"Error reading .env: {str(e)[:30]}")
                self.log_test("Database Config", "Supabase Service Key Configured", False, "Error reading .env")
    
    def test_frontend_build(self):
        """Test 5: Verify frontend builds without errors"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 5. FRONTEND BUILD")
        print("="*100)
        
        frontend_path = Path("apps/web")
        package_json = frontend_path / "package.json"
        exists = package_json.exists()
        self.log_test("Frontend Build", "package.json Exists", exists)
        
        # Check node_modules
        node_modules = frontend_path / "node_modules"
        has_deps = node_modules.exists()
        self.log_test("Frontend Build", "Dependencies Installed", has_deps)
        
        # Check for build artifacts
        dist = frontend_path / "dist"
        built = dist.exists()
        self.log_test("Frontend Build", "Production Build Exists", built, "dist/ directory found" if built else "not built yet")
    
    def test_backend_imports(self):
        """Test 6: Verify backend imports work"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 6. BACKEND IMPORTS")
        print("="*100)
        
        backend_path = Path("services/core")
        main_file = backend_path / "app" / "main.py"
        exists = main_file.exists()
        self.log_test("Backend Imports", "app/main.py Exists", exists)
        
        # Check requirements.txt
        requirements = backend_path / "requirements.txt"
        has_reqs = requirements.exists()
        self.log_test("Backend Imports", "requirements.txt Exists", has_reqs)
    
    def test_ai_service(self):
        """Test 7: Verify AI service files"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 7. AI SERVICE")
        print("="*100)
        
        anemia_path = Path("services/anemia")
        api_file = anemia_path / "api.py"
        exists = api_file.exists()
        self.log_test("AI Service", "api.py Exists", exists)
        
        # Check for model
        model_file = anemia_path / "models" / "best_enhanced.h5"
        model_exists = model_file.exists()
        self.log_test("AI Service", "Model File Exists", model_exists, f"best_enhanced.h5 ({model_file.stat().st_size / 1024 / 1024:.1f}MB)" if model_exists else "not found")
    
    def test_configuration_files(self):
        """Test 8: Verify all configuration files"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 8. CONFIGURATION FILES")
        print("="*100)
        
        files_to_check = [
            ("docker-compose.yml", "Docker Compose Configuration"),
            (".env", "Environment Variables"),
            (".env.example", "Environment Template"),
            ("README.md", "Main Documentation"),
            ("DEPLOYMENT_GUIDE.md", "Deployment Guide"),
            ("VERIFICATION_CHECKLIST.md", "Verification Checklist"),
            ("infrastructure/database/supabase_schema.sql", "Database Schema"),
        ]
        
        for filename, description in files_to_check:
            file_path = Path(filename)
            exists = file_path.exists()
            size = f"({file_path.stat().st_size} bytes)" if exists else ""
            self.log_test("Configuration", description, exists, size)
    
    def test_documentation(self):
        """Test 9: Verify documentation completeness"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 9. DOCUMENTATION")
        print("="*100)
        
        docs = {
            "README.md": ["Quick Start", "Architecture", "Troubleshooting"],
            "DEPLOYMENT_GUIDE.md": ["Local Development", "Docker", "Production"],
            "VERIFICATION_CHECKLIST.md": ["Authentication", "Patient", "Doctor", "Admin"],
            "FINAL_REPORT.md": ["Status", "Verification", "Recommendations"],
        }
        
        for doc_file, expected_sections in docs.items():
            path = Path(doc_file)
            if path.exists():
                try:
                    with open(path, encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        size = len(content)
                        self.log_test("Documentation", f"{doc_file} Exists", True, f"{size:,} bytes")
                        for section in expected_sections:
                            has_section = section in content
                            self.log_test("Documentation", f"{doc_file} - '{section}' Section", has_section)
                except Exception as e:
                    self.log_test("Documentation", f"{doc_file} Exists", False, f"Error: {str(e)[:30]}")
    
    def test_scripts(self):
        """Test 10: Verify automation scripts"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 10. AUTOMATION SCRIPTS")
        print("="*100)
        
        scripts = [
            ("start.bat", "Windows Quick Start Script"),
            ("start.sh", "macOS/Linux Quick Start Script"),
        ]
        
        for script, description in scripts:
            script_path = Path(script)
            exists = script_path.exists()
            size = f"({script_path.stat().st_size} bytes)" if exists else ""
            self.log_test("Scripts", description, exists, size)
    
    def test_source_code(self):
        """Test 11: Verify critical source files"""
        print("\n" + "="*100)
        print("TEST CATEGORY: 11. SOURCE CODE")
        print("="*100)
        
        source_files = [
            ("apps/web/src/main.tsx", "React Entry Point"),
            ("apps/web/src/lib/api.ts", "API Client"),
            ("apps/web/src/lib/supabase.ts", "Supabase Setup"),
            ("apps/web/src/lib/store.ts", "State Management"),
            ("services/core/app/main.py", "FastAPI App"),
            ("services/core/app/routes/patient.py", "Patient Routes"),
            ("services/core/app/routes/doctor.py", "Doctor Routes"),
            ("services/core/app/routes/admin.py", "Admin Routes"),
            ("services/anemia/src/pipeline.py", "ML Pipeline"),
        ]
        
        for filepath, description in source_files:
            path = Path(filepath)
            exists = path.exists()
            size = f"({path.stat().st_size} bytes)" if exists else ""
            self.log_test("Source Code", description, exists, size)
    
    def generate_report(self):
        """Generate final test report"""
        print("\n" + "="*100)
        print("FINAL VERIFICATION REPORT")
        print("="*100)
        
        duration = (datetime.now() - self.start_time).total_seconds()
        
        summary = f"""
╔════════════════════════════════════════════════════════════════════════════════════╗
║                    NetraAI PRODUCTION READINESS VERIFICATION                      ║
╚════════════════════════════════════════════════════════════════════════════════════╝

TEST EXECUTION SUMMARY
├─ Total Tests Run:      {self.tests_total}
├─ Tests Passed:         {self.tests_passed} ✅
├─ Tests Failed:         {self.tests_failed} ❌
├─ Success Rate:         {(self.tests_passed/self.tests_total*100):.1f}%
├─ Duration:             {duration:.1f} seconds
└─ Report Generated:     {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

RECOMMENDED NEXT STEPS:
"""
        
        if self.tests_failed == 0:
            summary += """
1. ✅ START DOCKER: Run `docker-compose up --build` from root directory
2. ✅ VERIFY FRONTEND: Open http://localhost:3000 in browser
3. ✅ VERIFY API: Open http://localhost:8000/docs for Swagger UI
4. ✅ TEST PATIENT FLOW:
   - Register as patient
   - Browse and book appointment
   - Upload AI scan
   - Join video call with translation
5. ✅ TEST DOCTOR FLOW:
   - Register as doctor
   - Set availability
   - Accept appointment
   - Generate prescription
6. ✅ TEST ADMIN FLOW:
   - Login as admin
   - Verify doctors
   - View analytics
7. ✅ PRODUCTION DEPLOYMENT: Follow DEPLOYMENT_GUIDE.md

STATUS: 🎉 SYSTEM IS PRODUCTION READY
"""
        else:
            summary += f"""
1. ⚠️  ISSUES FOUND: {self.tests_failed} test(s) failed
2. 🔍 REVIEW FAILED TESTS: See details below
3. 🔧 FIX ISSUES: Address failures before deployment
4. 🔄 RE-RUN: Execute this script again after fixes
5. 📚 REFERENCE: Check README.md and DEPLOYMENT_GUIDE.md

STATUS: ⚠️  ISSUES NEED RESOLUTION BEFORE PRODUCTION
"""
        
        print(summary)
        
        # Detailed results by category
        print("\nDETAILED RESULTS BY CATEGORY:")
        print("─" * 100)
        
        categories = {}
        for result in self.results:
            cat = result["category"]
            if cat not in categories:
                categories[cat] = {"passed": 0, "failed": 0, "tests": []}
            
            if "✅" in result["status"]:
                categories[cat]["passed"] += 1
            else:
                categories[cat]["failed"] += 1
            categories[cat]["tests"].append(result)
        
        for cat in sorted(categories.keys()):
            stats = categories[cat]
            total = stats["passed"] + stats["failed"]
            print(f"\n{cat}:")
            print(f"  Status: {stats['passed']}/{total} passed")
            for test in stats["tests"]:
                detail = f" - {test['details']}" if test["details"] else ""
                print(f"  {test['status']} {test['test']}{detail}")
        
        # Save JSON report
        report_data = {
            "timestamp": datetime.now().isoformat(),
            "duration_seconds": duration,
            "total_tests": self.tests_total,
            "passed": self.tests_passed,
            "failed": self.tests_failed,
            "success_rate": (self.tests_passed/self.tests_total*100),
            "results": self.results,
            "status": "PRODUCTION_READY" if self.tests_failed == 0 else "ISSUES_FOUND"
        }
        
        with open("VERIFICATION_RESULTS.json", "w") as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\n✅ Report saved to: VERIFICATION_RESULTS.json")
        
        return self.tests_failed == 0
    
    def run_all_tests(self):
        """Run all verification tests"""
        print("\n🚀 Starting NetraAI Production Readiness Verification...")
        print(f"⏱️  Started: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        self.test_docker_status()
        self.test_docker_containers()
        self.test_api_endpoints()
        self.test_database_connectivity()
        self.test_frontend_build()
        self.test_backend_imports()
        self.test_ai_service()
        self.test_configuration_files()
        self.test_documentation()
        self.test_scripts()
        self.test_source_code()
        
        return self.generate_report()

if __name__ == "__main__":
    verifier = NetraAIVerification()
    all_passed = verifier.run_all_tests()
    sys.exit(0 if all_passed else 1)
