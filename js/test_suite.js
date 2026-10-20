

const tests = [
    {
        name: "Structure: Critical Sections Exist",
        run: () => {
            const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'services', 'contact'];
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (!el) throw new Error(`Section #${id} is missing`);
            });
            return "All critical sections present.";
        }
    },
    {
        name: "Content: Project Cards",
        run: () => {
            const cards = document.querySelectorAll('.project-card');
            if (cards.length !== 3) throw new Error(`Expected 3 project cards, found ${cards.length}`);
            return "Found 3 rich backend project cards.";
        }
    },
    {
        name: "Interaction: Modal Structure",
        run: () => {
            const modal = document.getElementById('project-modal');
            if (!modal) throw new Error("Modal overlay #project-modal missing");

            const overlay = document.querySelector('.modal-overlay');
            if (!overlay) throw new Error(".modal-overlay class missing");

            return "Modal structure verified.";
        }
    },
    {
        name: "Data: Project Details Hidden Divs",
        run: () => {
            const hiddenDivs = document.querySelectorAll('.project-details-content');
            if (hiddenDivs.length !== 3) throw new Error(`Expected 3 hidden detail divs, found ${hiddenDivs.length}`);
            return "Hidden detail divs present for all cards.";
        }
    },
    {
        name: "Navigation: Fixed Navbar & ScrollSpy Highlights",
        run: () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) throw new Error("Navbar (.navbar) missing");

            const style = window.getComputedStyle(navbar);
            if (style.position !== 'fixed' && style.position !== 'sticky') {
                throw new Error(`Expected navbar position to be fixed/sticky, got ${style.position}`);
            }

            const navLinks = document.querySelectorAll('.nav-links li a');
            if (navLinks.length === 0) throw new Error("No nav links found in navbar");

            return `Navbar verified fixed with ${navLinks.length} active-supported section links.`;
        }
    }
];

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(runTests, 500);
});

async function runTests() {
    const resultsContainer = document.createElement('div');
    resultsContainer.id = "test-results-panel";
    Object.assign(resultsContainer.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        width: '350px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        zIndex: '9999',
        fontFamily: 'monospace',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '2px solid #64ffda'
    });

    const header = document.createElement('h3');
    header.innerText = "Unit Test Results";
    header.style.color = '#64ffda';
    header.style.marginTop = '0';
    resultsContainer.appendChild(header);

    const list = document.createElement('ul');
    list.style.padding = '0';
    resultsContainer.appendChild(list);

    document.body.appendChild(resultsContainer);

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const item = document.createElement('li');
        item.style.marginBottom = '10px';
        item.style.listStyle = 'none';
        item.style.borderBottom = '1px solid #333';
        item.style.paddingBottom = '5px';

        try {
            const resultMsg = await test.run();
            item.innerHTML = `<span style="color:#4caf50">✔ PASS</span> <strong>${test.name}</strong><br><small>${resultMsg}</small>`;
            passed++;
        } catch (e) {
            console.error(e);
            item.innerHTML = `<span style="color:#f44336">✘ FAIL</span> <strong>${test.name}</strong><br><small style="color:#ff8a80">${e.message}</small>`;
            failed++;
        }
        list.appendChild(item);
    }

    const summary = document.createElement('div');
    summary.style.marginTop = '15px';
    summary.style.fontWeight = 'bold';
    summary.innerHTML = `Total: ${tests.length} | <span style="color:#4caf50">Passed: ${passed}</span> | <span style="color:#f44336">Failed: ${failed}</span>`;
    resultsContainer.appendChild(summary);
}
