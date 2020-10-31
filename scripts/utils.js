/* =================================================
 * Utilities
 * @author filipditrich
 * ================================================= */

// ================== imports ====================== //
import { gsap, Power4 } from "./libs/gsap/src/index";
import { ScrollToPlugin } from "./libs/gsap/src/ScrollToPlugin";
import { TextPlugin } from "./libs/gsap/src/TextPlugin";
import { ScrollTrigger } from "./libs/gsap/src/ScrollTrigger";
import { TweenLite } from "./libs/gsap/src/index";

// =============== initializations ================ //
gsap.registerPlugin(ScrollToPlugin, TextPlugin, ScrollTrigger);

// ================== variables =================== //
// common
const $BODY = $("body");
const $PAGE_PRELOAD = $("#mo-preloader");
const $PAGE_WRAPPER = $("#mo-page-wrapper");
const $PAGE_HEADER = $("#mo-page-header");
const $PAGE_CONTENT = $("#mo-page-content");
const $CURSOR_CIRCLE = $("#mo-cursor");
const PAGE_SECTIONS = {
    header: {
        selector: $PAGE_HEADER,
        // ---
        arrow: $("#mo-page-header .mo-header-arrow"),
    },
    "section-1": {},
    projects: {
        selector: $("#projects"),
        wrapper: $("#projects > .mo-project-wrapper"),
        get title() { return this.selector.attr("mo-title"); },
        // ---
        slider: $("#projects > .mo-section-wrapper > .mo-project-slider"),
        slides: $("#projects > .mo-section-wrapper > .mo-project-slider .mo-project-slide"),
    },
    "section-3": {},
    footer: {}
}

// animations
const SCROLL_DURATION = 1200; // 2500 when I figure out how to implement slow smooth-scrolling
const ANIMATION_DURATION = 1200;
const LOAD_ANIMATION_DUR = 2500;
const AFTER_LOAD_ANIM_DUR = 1200;
// $load-transition SCSS variable || TODO: import variables

// simple bar
const SIMPLEBAR = new SimpleBar($PAGE_WRAPPER[0]);
const $SIMPLEBAR_EL = $(SIMPLEBAR.getScrollElement());
const $SIMPLEBAR_CONTENT = $(SIMPLEBAR.getContentElement());

// scrollbar navigators
const CHEVRON_UP = $(".mo-section-navigator.up");
const CHEVRON_DOWN = $(".mo-section-navigator.down");

// scroll magic
const SCROLL_MAGIC_CONTROLLER = new ScrollMagic.Controller({
    container: $SIMPLEBAR_EL[0],
    refreshInterval: 0,
});

// ================== functions ====================== //
/**
 * Menu toggle
 * @param open
 */
function openMenu(open = true) {
    if (open) {
        $BODY.addClass("is-loading").addClass("is-menuOpen");
    } else {
        $BODY.removeClass("is-menuOpen").removeClass("is-loading");
    }
}

/**
 * Animate to <to=string<id>|number<px>|max> location
 * @param to
 * @param reset
 */
function scrollTo(to, reset = false) {
    if (!to && to !== 0) {
        console.error("Value 'to' provided for scrollTop function cannot be undefined.")
        return;
    }

    // anchor links
    if (isNaN(Number(to)) && !/max/.test(to)) {
        to = /#/g.test(to) ? to : "#" + to;
        history.replaceState(null, null, document.location.pathname + to);
    }

    // reset hash
    if (reset || /max/.test(to))
        history.replaceState(null, null, document.location.pathname);

    // animate with gsap
    TweenLite.to($SIMPLEBAR_EL[0], SCROLL_DURATION / 1000, { scrollTo: { y: to, autoKill: false }, ease: Power4.easeInOut }); //TODO
}

/**
 * Return page sections or their attribute <by> values
 * @param by
 * @returns {[]|*|jQuery.fn.init|jQuery|HTMLElement}
 */
function sectionsBy(by = null) {
    const sections = $("[mo-title]");
    if (!by) return sections;

    const returnSections = [];
    $.each(sections, (index, el) => {
        returnSections.push($(el).attr(by));
    });
    return returnSections;
}

/**
 * Page scroll when header is in use
 * @param y
 */
function pageHeaderTween(y) {
    TweenLite.to($SIMPLEBAR_EL[0], SCROLL_DURATION / 1000, {
        scrollTo: { y, autoKill: false },
        ease: Power4.easeInOut,
    });
}

/**
 * Simulates scroll behavior
 * @param delta
 * @param multiplier
 */
function createSimulatedScroll(delta, multiplier = 1) {
    const offset = $SIMPLEBAR_EL.scrollTop() - (delta * multiplier);
    $SIMPLEBAR_EL.scrollTop(offset);
}

// ================== exports ====================== //
export {
    $BODY,
    $PAGE_PRELOAD,
    $PAGE_HEADER,
    $PAGE_WRAPPER,
    $CURSOR_CIRCLE,
    $PAGE_CONTENT,
    PAGE_SECTIONS,
    SIMPLEBAR,
    $SIMPLEBAR_EL,
    CHEVRON_DOWN,
    CHEVRON_UP,
    SCROLL_MAGIC_CONTROLLER,
    ANIMATION_DURATION,
    LOAD_ANIMATION_DUR,
    AFTER_LOAD_ANIM_DUR,
    $SIMPLEBAR_CONTENT,
    openMenu,
    sectionsBy,
    createSimulatedScroll,
    scrollTo,
    pageHeaderTween,

    gsap,
};