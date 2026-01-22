import sys
import pkg_resources

def check_requirements():
    try:
        with open('requirements.txt', 'r') as f:
            requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    except FileNotFoundError:
        print("requirements.txt not found.")
        sys.exit(1)
    
    missing = []
    for requirement in requirements:
        try:
            pkg_resources.require(requirement)
        except pkg_resources.DistributionNotFound:
            missing.append(requirement)
        except pkg_resources.VersionConflict as e:
            print(f"Version conflict for {requirement}: {e}")
            missing.append(requirement)
    
    if missing:
        print("Missing dependencies:")
        for pkg in missing:
            print(f"  {pkg}")
        sys.exit(1)
    
    print("All dependencies satisfied.")

if __name__ == "__main__":
    check_requirements()
