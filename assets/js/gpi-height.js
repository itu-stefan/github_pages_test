(() => {
    const TYPE = "gpi:height";

    const calcHeight = () => {
        const doc = document.documentElement;
        const body = document.body;

        const h1 = doc ? doc.scrollHeight : 0;
        const h2 = body ? body.scrollHeight : 0;
        const h3 = doc ? doc.offsetHeight : 0;
        const h4 = body ? body.offsetHeight : 0;

        return Math.max(h1, h2, h3, h4, 200);
    };

    const post = () => {
        // NOTE: You can restrict this "*" later once it works
        window.parent.postMessage({ type: TYPE, height: calcHeight() }, "*");
    };

    // Post on load + after a short delay (fonts/images/layout)
    window.addEventListener("load", () => {
        post();
        setTimeout(post, 150);
        setTimeout(post, 600);
    });

    window.addEventListener("resize", () => post());

    // Mutation observer for dynamic pages
    if (window.MutationObserver) {
        const obs = new MutationObserver(() => post());
        obs.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    }

    // For SPAs: hook into history navigation
    const _pushState = history.pushState;
    history.pushState = function () {
        _pushState.apply(this, arguments);
        setTimeout(post, 50);
        setTimeout(post, 250);
    };
    window.addEventListener("popstate", () => {
        setTimeout(post, 50);
        setTimeout(post, 250);
    });

    // Expose manual trigger for debugging
    window.gpiPostHeight = post;
})();
