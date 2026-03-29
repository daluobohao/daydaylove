<template>
    <div class="w-full flex h-full min-h-0 border-r">
        <div class="w-full border-r bg-cus-gfa">
            <div class="flex flex-col items-center w-full">
                <div class="py-4">
                    <a class="flex px-1 items-center" href="/">
                        <img src="/logo.png" class=""/>
                    </a>
                </div>
                <div @click="tabClick('template')" class="w-full text-center cursor-pointer mt-2 py-4" :class="{'bg-cus-lightActive': activeTab == 'template'}">
                    <div class="w-10 m-auto">
                        <div class="flex justify-center">
                            <svg t="1676388732877" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2801" width="28" height="28"><path d="M734.016 723.104V640.32h-59.904v36.992l-35.712 9.696 15.712 57.792z m-59.904-246.4h59.904v81.792h-59.904z m59.904-180.896l-95.616 26.016 15.712 57.792 20-5.408v20.704h59.904z m132.096 468.896v36.992l-35.712 9.696 7.904 28.896 7.808 28.896 79.904-21.696v-82.784h-29.888z m-125.216 71.008l-89.504 24.288 7.904 28.896 7.808 28.992 89.504-24.384-7.808-28.896z m0-721.408l-89.504 24.288 7.904 28.896 7.808 28.896 89.504-24.288-7.808-28.896z m89.504-24.288l7.904 28.896 7.808 28.896 20-5.504v20.8h59.904V64z m35.712 193.376v120.288h59.904V283.392h-29.888z m0 240.704v120.288h59.904v-120.288h-29.888zM541.888 230.4l35.712-9.696-15.616-57.792-50.016 13.6L97.952 64v783.488L511.968 960l65.6-17.792-15.616-57.792-20 5.408v-114.592l35.712-9.696-15.712-57.792-20 5.408v-303.104l35.712-9.696-15.712-57.792-20 5.408V230.464z m-59.776 659.392L157.92 801.696V142.304L482.112 230.4v117.6l-192-52.192v427.296l192 52.192v114.496z m0-360.896v184.288l-132.192-35.904v-303.104l132.192 35.904v118.784z" p-id="2802"></path></svg>
                        </div>
                        <div class="text-xs mt-1">查看</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const activeTab = ref('template')

const tabClick = (active: string) => {
    activeTab.value = active
}
</script>
