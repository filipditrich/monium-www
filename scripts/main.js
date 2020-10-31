/* =================================================
 * Main Entry Script
 * @author filipditrich
 *
 * TODO:
 * [✔]   convert all animations to gsap!
 * [✔]   place init functions to separate file
 * [✔]   global cursor
 * [ ]   change cursor into arrow on sides (slide to next/previous project)
 * [✔]   create preloading/lazy-loading function
 * ================================================= */

// ================== imports ====================== //
import { $BODY, $PAGE_PRELOAD, PAGE_SECTIONS, $CURSOR_CIRCLE, LOAD_ANIMATION_DUR, ANIMATION_DURATION } from "./utils";
import { initCursor, initHero, initNavs, initScrollbar, initSections, initSmoothScrolling } from "./initializers";

// ================= functions ===================== //
/**
 * Page Preloader
 */
(function preloadPage() {
    const resources = [];
    let current = 0;

    // get all non-script elements and check for resource urls
    $BODY.find("*:not(script)").each(function () {
        let url = "";

        if ($(this).css("background-image").indexOf("none") === -1) {
            // get url from css background-image property
            url = $(this).css("background-image");
            if (url.indexOf("url") !== -1) {
                const temp = url.match(/url\((.*?)\)/);
                url = temp[1].replace(/"/g, "");
            }
        } else if ($(this).get(0).nodeName.toLowerCase() === "img"
            && typeof ($(this).attr("src")) !== "undefined") {
            // get url from img element
            url = $(this).attr("src");
        } else if (0 === 1) {
            // TODO: get video url from video element
        }

        // push to the resources array
        if (url.length > 0) resources.push(url);
    });

    // on complete load events
    const completeLoading = () => {
        current++;

        // calculate the percentage progress
        const per = Math.round((current / resources.length) * 100);
        $(".loader-percentage").text(per); // TODO: animate (gsap text?)

        // all done
        if (current >= resources.length) {
            current = resources.length;

            // register page loaded and after-loaded state
            $BODY.removeClass("is-loading");
            setTimeout(() => {
                $("[mo-super-link]").addClass("blink")
                $BODY.addClass("is-animated");
                $PAGE_PRELOAD.remove();
            }, LOAD_ANIMATION_DUR);
        }
    }

    // resource loader
    const loadResource = (url) => {
        // create new image
        const image = new Image();

        // on image load/fail
        $(image).attr("src", url)
            .on("load error", completeLoading);
    }

    // preload all resources
    for (const resource of resources)
        loadResource(resource);
})();

/**
 * Main Script Launcher
 */
$(function () {
    // ========== core component initialization ========= //
    initSmoothScrolling();
    initScrollbar();
    initNavs();
    initHero();
    initCursor();
    initSections();

    // ==================== projects =================== //
    $(PAGE_SECTIONS.projects.slides).each((index, slide) => {
        $(slide).hover3d({
            selector: ".hover-content",
            sensitivity: 50,
            out: ANIMATION_DURATION,
        }).find(".hover-content")
            .mouseenter(() => {
                $BODY.click(() => {
                    // TODO: open project page or something idk yet
                    alert($(slide).attr("id"));
                });
                $CURSOR_CIRCLE.addClass("project-hover");
            })
            .mouseleave(() => {
                $BODY.unbind("click");
                $CURSOR_CIRCLE.removeClass("project-hover");
            })
    });
});