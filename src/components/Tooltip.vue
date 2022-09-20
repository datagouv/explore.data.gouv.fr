<template>
    <div 
        class="fr-p-2w relCell"
        ref="tooltip"
    >
    <p class="fr-text--xs relCell-explanation">
        <span class="fr-fi--sm fr-icon-lightbulb-line" aria-hidden="true"></span>
        {{ explanation }}
    </p>
    <p class="fr-text--bold fr-m-0">
        {{ content }}
    </p>
    <a 
        v-if="linkHref"
        class="fr-text--sm"
        :href="linkHref"
        target="_blank"
    >
        {{ link }}
    </a>
    </div>
</template>
<script>
export default {
    props: {
        explanation: {
            type: String,
            required: true,
        },
        content: {
            type: String,
        },
        link: {
            type: String,
        },
        linkHref: {
            type: String,
        }
    },
    data() {
        return {
            listener: null,
        }
    },
    methods: {
        moveTooltipIfRequired() {
            const rect = this.$refs.tooltip.getBoundingClientRect()
            if(document.documentElement.clientWidth < rect.width) {
                this.$refs.tooltip.style.left = `-${rect.x}px`
                this.$refs.tooltip.style.width = `${document.documentElement.clientWidth}px`
            } else {
                if(rect.right > document.documentElement.clientWidth) {
                    this.$refs.tooltip.style.left = `-${rect.right - document.documentElement.clientWidth}px`
                }
            }
        }
    },
    mounted() {
        this.moveTooltipIfRequired()
        this.listener = document.addEventListener('resize', this.moveTooltipIfRequired)
    },
    beforeDestroy() {
        if(this.listener) {
            document.removeEventListener('resize', this.listener)
        }
    }
}
</script>

<style scoped>
.relCell-explanation {
    color: var(--text-mention-grey);
    font-style: italic;
}

.relCell {
    z-index: 51;
    position: absolute;
    bottom: -80px;
    left: 4px;
    width: 450px;
    background-color: white;
    font-weight: normal;
    font-size: 13px;
    box-shadow: 0px 1px 4px 0px #0000003B,
                0px 1px 0px -2px #00000029,
                0px 1px 1px 0px #00000029;
}
</style>
