/* =================================================
 * Initializers
 * @author filipditrich
 * ================================================= */

// ================== imports ====================== //
import { Power2, Power4, TimelineMax, TweenLite } from "./libs/gsap/src/index.js";
import {
    AFTER_LOAD_ANIM_DUR,
    CHEVRON_DOWN,
    CHEVRON_UP, gsap, LOAD_ANIMATION_DUR,
    openMenu,
    $PAGE_HEADER,
    PAGE_SECTIONS, pageHeaderTween,
    SCROLL_MAGIC_CONTROLLER,
    scrollTo,
    sectionsBy, SIMPLEBAR,
    $SIMPLEBAR_EL, $CURSOR_CIRCLE, $BODY
} from "./utils.js";

// ================= functions ===================== //
/**
 * Initialize hero
 */
function initHero() {
    // scroll to the first section ("explore" arrow)
    PAGE_SECTIONS.header.arrow.click(function(event) {
        event.preventDefault();
        pageHeaderTween(`#${ sectionsBy("id")[0] }`);
    });

    // immediately scroll down (to the first sections) on header when user starts scrolling
    new ScrollMagic.Scene({
        triggerHook: "onLeave",
        triggerElement: $PAGE_HEADER[0],
        offset: 2
    }).on("enter", () => {
        if (!location.hash) pageHeaderTween(`#${ sectionsBy("id")[0] }`);
    }).addTo(SCROLL_MAGIC_CONTROLLER).addIndicators()


    // immediately scroll to the top when users starts scrolling above the first section
    new ScrollMagic.Scene({
        triggerHook: "onLeave",
        triggerElement: $PAGE_HEADER[0],
        offset: $PAGE_HEADER.innerHeight(),
    }).on("leave", () => {
        pageHeaderTween(0);
    }).addTo(SCROLL_MAGIC_CONTROLLER).addIndicators();
}

/**
 * Initialize navigations
 */
function initNavs() {
    // on logo click
    $(".mo-nav-logo").click(() => {
        // TODO: link to root page?
        scrollTo(0);
    })

    // menu trigger
    // TODO: simulated scroll on scrollOver
    $(".mo-menu-trigger").click(({ currentTarget }) => {
        openMenu($(currentTarget).attr("mo-menu-close-trigger"));
    });

    // scroll event
    $SIMPLEBAR_EL.scroll((event) => {
        // menu nav links
        const mostVisibleSection = $("#mo-page-content .mo-page-section").mostVisible()[0];
        const name = $(mostVisibleSection).attr("id") || "";
        $(".mo-menu-links li").removeClass("viewing");
        $(`.mo-menu-links li a[href="#${ name }"]`).parent().addClass("viewing");

        // super class
        if ($SIMPLEBAR_EL.scrollTop() >= $("#mo-page-header").outerHeight())
            $("[mo-super-link]").removeClass("super");
        else $("[mo-super-link]").addClass("super");
    });

    // TODO: simulate scroll over the fixed nav
    // $("#page-header").mousewheel((event, delta) => { createSimulatedScroll(delta); });
    // $(".simplebar-track").mousewheel((event, delta) => { createSimulatedScroll(delta); });
}

/**
 * Initialize smooth scrolling (anchors)
 */
function initSmoothScrolling() {
    $SIMPLEBAR_EL.scrollTop(1);

    // on document load
    setTimeout(() => {
        if (location.hash && location.hash === `#${ sectionsBy("id")[0] }`)
            pageHeaderTween(`#${ sectionsBy("id")[0] }`);
        else scrollTo(location.hash || 0);
    }, LOAD_ANIMATION_DUR + AFTER_LOAD_ANIM_DUR); // necessary timeout (due to simplebar.js rendering delay)

    // internal link/anchor click
    $("a[href*=\\#]").click(function(event) {
        event.preventDefault();
        scrollTo(this.hash);
        openMenu(false);
    });
}

/**
 * Initialize scrollbar miscellaneous
 */
function initScrollbar() {

    // scrollbar tooltip
    const tooltip = $(".mo-section-tooltip");
    $(".simplebar-scrollbar").append(tooltip);
    tooltip.click(function () {
        const title = $(this).text();
        if (!title) return;

        const target = $(`[mo-title="${ title }"]`);
        scrollTo($(target).attr("id"));
    });

    CHEVRON_UP.addClass("mo-default-icon");
    CHEVRON_DOWN.addClass("mo-default-icon");
    $(".simplebar-track.simplebar-vertical").append(CHEVRON_UP).append(CHEVRON_DOWN);
    $(".mo-section-navigator").click(function () {
        const isUp = $(this).hasClass("up");
        if ($(this).find(".dup").length) {
            scrollTo(isUp ? 0 : ($(SIMPLEBAR.getContentElement()).outerHeight() - $($SIMPLEBAR_EL).outerHeight()));
        } else {
            const i = Number($("body").attr("mo-view")) + (isUp ? -1 : 1);
            // scrollTo(sectionsBy("id")[i] || (isUp ? 0 : "max"));
            if (i === 0 || (!sectionsBy("id")[i])) {
                console.log("1")
                TweenLite.to($SIMPLEBAR_EL[0], 1, {
                    scrollTo: {
                        y: isUp ? 0 : "max",
                        autoKill: false
                    },
                    ease: Power4.easeInOut,
                });
            } else {
                console.log("2")
                scrollTo(sectionsBy("id")[i]);
            }
        }
    });

    // fast-forward scroll
    let chevronUpHoverTimeout, chevronDownHoverTimeout;
    CHEVRON_UP.hover(() => {
        chevronUpHoverTimeout = setTimeout(() => {
            const svg = CHEVRON_UP.find("svg").clone();
            svg.addClass("dup");
            CHEVRON_UP.append(svg);
            // TODO: animate -> gsap
            svg.animate({
                top: "-7px"
            }, 600, "swing");
        }, 1000);
    }, () => {
        clearTimeout(chevronUpHoverTimeout);
        CHEVRON_UP.find(".dup").remove();
    });
    CHEVRON_DOWN.hover(() => {
        chevronDownHoverTimeout = setTimeout(() => {
            const svg = CHEVRON_DOWN.find("svg").clone();
            svg.addClass("dup");
            CHEVRON_DOWN.append(svg);
            svg.animate({
                bottom: "-7px"
            }, 600, "swing");
        }, 1000);
    }, () => {
        clearTimeout(chevronDownHoverTimeout);
        CHEVRON_DOWN.find(".dup").remove();
    });

    // scroll event
    let currentTitle = "";
    $SIMPLEBAR_EL.scroll(() => {
        const mostVisibleSection = $("#mo-page-content .mo-page-section, #mo-page-header").mostVisible()[0];
        const title = $SIMPLEBAR_EL.scrollTop() + $SIMPLEBAR_EL.outerHeight() < $(".simplebar-content").outerHeight() - ($("#mo-page-footer").outerHeight() / 2) ?
            ($(mostVisibleSection).attr("mo-title") || "") : "";
        let tooltip = $(".mo-section-tooltip")[1];
        tooltip = $(tooltip);

        // set the current page view
        $("body").attr("mo-view", sectionsBy("mo-title")
            .findIndex((sectionTitle) => sectionTitle === title));

        // TODO: tooltip to have project titles or something
        // if (title !== "PROJECTS")

        // change tooltip text
        if (currentTitle.toUpperCase() !== title.toUpperCase()) {
            currentTitle = title;

            // animate tooltip change
            gsap.to(tooltip, {
                text: title,
                ease: Power2.easeInOut,
                duration: 1,
            });

            // silently replace hash in the url
            let sectionId = $(`[mo-title="${ title }"`).attr("id") || "";
            if (sectionId !== "") sectionId = "#" + sectionId;
            history.replaceState(null, null, document.location.pathname + sectionId);
        }

        // navigator arrows
        const sectionTitles = sectionsBy("mo-title");
        CHEVRON_UP.toggleClass("disabled", $SIMPLEBAR_EL.scrollTop() < 50);
        CHEVRON_DOWN.toggleClass("disabled", title === sectionTitles[sectionTitles.length - 1]);
    });
}

/**
 * Initialize custom following cursor
 */
function initCursor() {
    const handleCursor = (e) => {
        // animate the cursor
        const hoverLink = $("a.mo-link:hover");
        const hoverMentionableContent = $(`
            .mo-nav-social-link:hover,
            .mo-menu-trigger:hover,
            .mo-header-arrow:hover,
            .simplebar-track.simplebar-vertical:hover,
            .mo-icon-click:hover
        `);
        const linkCSS = {
            left: $(hoverLink).offset()?.left,
            top: $(hoverLink).offset()?.top + $(hoverLink)?.outerHeight() + 2,
            width: $(hoverLink)?.outerWidth(),
            minWidth: $(hoverLink)?.outerWidth(),
            height: 1,
            minHeight: 1,
            background: "var(--primary)",
            borderRadius: 0
        };
        const moveCSS = {
            width: 48,
            height: 48,
            minWidth: 48,
            minHeight: 48,
            background: "transparent",
            borderRadius: "50%",
            borderColor: hoverMentionableContent.length ? "var(--primary)" : "rgba(255, 255, 255, 0.25",
            left: e.pageX - $CURSOR_CIRCLE.outerWidth() / 2,
            top: e.pageY - $CURSOR_CIRCLE.outerHeight() / 2
        };

        TweenLite.to($CURSOR_CIRCLE, 0.6, { css: hoverLink.length ? linkCSS : moveCSS });
    }

    // update cursor on mousemove or on scroll event
    $BODY.mousemove((e) => handleCursor(e));
    $SIMPLEBAR_EL.scroll((e) => handleCursor(e));
}

/**
 * Initialize page sections
 */
function initSections() {
    const scenes = {};
    $("[mo-sliding]").each((index, section) => {
        const sectionWrapper = $(section).find(".mo-section-wrapper");
        const projectSlider = sectionWrapper.find(".mo-project-slider");
        const slides = projectSlider.find(".mo-project-slide");

        // set the scene
        projectSlider.css("min-width", `${ 100 * slides.length }%`);
        slides.each((i, slide) => $(slide).css("width", `${ 100 / slides.length }%`));

        // define movement of panels
        // TODO: maybe use the header->section-1 transition here aswell: on enter/on progress=50% immediately slide to another section
        const wipeAnimation = new TimelineMax();
        for (let i = 1; i < slides.length; i++) {
            wipeAnimation
                // .to(projectSlider, 0.5, { z: -150, delay: 0.5 })
                // .to($("#projects .mo-section-wrapper"), 1, { backgroundColor: $(slides[i - 1]).attr("mo-project-background") })
                .to(projectSlider, 1, {
                    x: `-${ (100 / slides.length) * i }%`,
                    delay: i === slides.length ? 0 : 0.5,
                    ease: Power2.easeInOut,
                })
            // .to(projectSlider, 0.5, { z: 0 });
        }

        // create scene to pin and link animation
        scenes.projects = new ScrollMagic.Scene({
            triggerElement: sectionWrapper[0],
            triggerHook: "onLeave",
            duration: `${ 100 * (slides.length + 1) }%`
        })
            .setPin(sectionWrapper[0])
            .setTween(wipeAnimation)
            .addIndicators()
            .addTo(SCROLL_MAGIC_CONTROLLER);
    });
    return scenes;
}

// ================== exports ====================== //
export { initHero, initNavs, initSmoothScrolling, initScrollbar, initCursor, initSections };
