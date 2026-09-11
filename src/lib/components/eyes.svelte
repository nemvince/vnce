<script lang="ts">
    // One-shot white sweep across the ascii art: hover on desktop, tap on touch.
    // Each sweep runs from the opposite side to the previous one.
    let shimmer = $state(false);
    let reversed = $state(false);

    const playShimmer = () => {
        if (shimmer) {
            return;
        }
        reversed = !reversed;
        shimmer = true;
    };

    // It also plays once on load, just after the entrance animation below.
    $effect(() => {
        const timer = setTimeout(() => (shimmer = true), 550);
        return () => clearTimeout(timer);
    });
</script>

<section class="pt-20 flex items-center justify-center intro-eyes select-none cursor-default">
    <pre
        id="eyes"
        class="text-accent text-xs md:text-base pb-12"
        class:shimmer
        class:reversed
        onpointerenter={playShimmer}
        onpointerdown={playShimmer}
        onanimationend={() => (shimmer = false)}>
                                   .::!!!!!!!:.
  .!!!!!:.                        .:!!!!!!!!!!!!
  ~~~~!!!!!!.                 .:!!!!!!!!!UWWW$$$
      :$$NWX!!:           .:!!!!!!XUWW$$$$$$$$$P
      $$$$$##WX!:      .&gt;!!!!UW$$$$"  $$$$$$$$#
      $$$$$  $$$UX   :!!UW$$$$$$$$$   4$$$$$*
      ^$$$B  $$$$\     $$$$$$$$$$$$   d$$R"
        "*$bd$$$$      '*$$$$$$$$$$$o+#"
             """"          """""""
    </pre>
</section>

<style>
    /* the ascii art is painted by the element's own background so the sweep
       can ride on top of the accent fill without duplicating the text. */
    @supports (background-clip: text) or (-webkit-background-clip: text) {
        #eyes {
            background-color: var(--color-accent);
            background-image: linear-gradient(
                100deg,
                transparent 45%,
                #fff 50%,
                transparent 55%
            );
            background-repeat: no-repeat;
            background-position: 0% 0;
            background-size: 300% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
        }
    }

    /* band starts off the left edge, exits past the right */
    #eyes.shimmer {
        animation: eyes-shimmer 1.1s ease-in-out;
    }

    #eyes.shimmer.reversed {
        animation-direction: reverse;
    }

    @keyframes eyes-shimmer {
        from {
            background-position: 100% 0;
        }
        to {
            background-position: 0% 0;
        }
    }

    /* css rather than a svelte transition: those only play for client-created
       nodes, so they'd never fire on the first paint of the ssr'd page. */
    .intro-eyes {
        animation: eyes-in 450ms cubic-bezier(0.215, 0.61, 0.355, 1) both;
    }

    @keyframes eyes-in {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .intro-eyes {
            animation: none;
        }
    }
</style>
