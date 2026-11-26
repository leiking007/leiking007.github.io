(() => {
    const root = document.getElementById("tag-posts");
    if (!root) return;

    const cloud = document.getElementById("tag-cloud");
    const groups = Array.from(root.querySelectorAll(".tag-posts-group"));
    if (!groups.length) return;

    const pagerSize = Math.max(1, parseInt(root.dataset.pagerSize, 10) || 5);
    const state = { tag: null, page: 1 };

    const findGroup = (tag) => groups.find((group) => group.dataset.tag === tag);

    const updateUrl = () => {
        const params = new URLSearchParams(window.location.search);
        params.set("tag", state.tag);
        if (state.page > 1) params.set("page", String(state.page));
        else params.delete("page");
        history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    };

    const renderPager = (group) => {
        const cards = Array.from(group.querySelectorAll(".post-entry"));
        const totalPages = Math.max(1, Math.ceil(cards.length / pagerSize));
        if (state.page > totalPages) state.page = totalPages;

        cards.forEach((card, index) => {
            card.hidden = Math.floor(index / pagerSize) + 1 !== state.page;
        });

        const nav = group.querySelector(".tag-pager");
        if (!nav) return;

        nav.querySelectorAll("[data-page]").forEach((el) => {
            const active = parseInt(el.dataset.page, 10) === state.page;
            el.classList.toggle("is-active", active);
            if (active) el.setAttribute("aria-current", "page");
            else el.removeAttribute("aria-current");
        });

        nav.querySelectorAll("[data-role]").forEach((el) => {
            const disabled = el.dataset.role === "prev" ? state.page <= 1 : state.page >= totalPages;
            el.classList.toggle("is-disabled", disabled);
            if (disabled) el.setAttribute("aria-disabled", "true");
            else el.removeAttribute("aria-disabled");
        });
    };

    const activate = (tag, page = 1) => {
        const group = findGroup(tag) || groups[0];
        if (!group) return;

        state.tag = group.dataset.tag;
        state.page = Math.max(1, parseInt(page, 10) || 1);

        groups.forEach((item) => {
            item.hidden = item !== group;
        });

        if (cloud) {
            cloud.querySelectorAll(".tag-cloud-item").forEach((link) => {
                const active = link.dataset.tag === state.tag;
                link.classList.toggle("is-active", active);
                if (active) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            });
        }

        renderPager(group);
        updateUrl();
    };

    if (cloud) {
        cloud.addEventListener("click", (event) => {
            const link = event.target.closest(".tag-cloud-item");
            if (!link) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            activate(link.dataset.tag, 1);
        });
    }

    root.addEventListener("click", (event) => {
        const button = event.target.closest(".tag-pager-btn");
        if (!button || !root.contains(button)) return;
        event.preventDefault();
        if (button.classList.contains("is-disabled")) return;

        const group = button.closest(".tag-posts-group");
        if (!group) return;

        if (button.dataset.role === "prev") state.page -= 1;
        else if (button.dataset.role === "next") state.page += 1;
        else if (button.dataset.page) state.page = parseInt(button.dataset.page, 10);
        else return;

        renderPager(group);
        updateUrl();
        group.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const params = new URLSearchParams(window.location.search);
    activate(params.get("tag"), parseInt(params.get("page"), 10) || 1);
})();
