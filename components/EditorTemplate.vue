<template>
    <div class="w-full flex h-full border-r">
        <div class="w-24 border-r bg-cus-gfa ">
            <div class="flex flex-col items-center w-full">
                <div class="py-4">
                    <a class="flex px-1 items-center" href="/">
                        <img src="/logo.png" class=""/>
                    </a>
                </div>
                <div @click="tabClick('template')" class="w-full text-center cursor-pointer mt-2 py-4" :class="{'bg-cus-lightActive': activeTab == 'template'}">
                    <div class="w-10 m-auto">
                        <div class="flex justify-center">
                            <!-- <svg t="1682263925925" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2671" width="36" height="36"><path d="M33.04 33.04v958.281h958.281V33.04H33.04z m916.919 916.64H74.4V74.679H950V949.68zM857.84 187.079H166.521V431.68H857.84V187.079z m-32.519 211.84H199.04v-179.04h626.281v179.04zM552.24 620.601h305.6v-124.8h-305.6v124.8z m32.56-92h240.521v59.241H584.8v-59.28zM552.24 794.64h305.6v-124.8h-305.6v124.8z m32.56-92.039h240.521v59.239H584.8v-59.239z m-411.28 158.72h305.6v-390.88h-305.6v390.88zM206.041 503.2h240.521v325.36h-240.56V503.2z" fill="#515151" p-id="2672"></path></svg> -->
                            <svg t="1676388732877" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2801" width="28" height="28"><path d="M734.016 723.104V640.32h-59.904v36.992l-35.712 9.696 15.712 57.792z m-59.904-246.4h59.904v81.792h-59.904z m59.904-180.896l-95.616 26.016 15.712 57.792 20-5.408v20.704h59.904z m132.096 468.896v36.992l-35.712 9.696 7.904 28.896 7.808 28.896 79.904-21.696v-82.784h-29.888z m-125.216 71.008l-89.504 24.288 7.904 28.896 7.808 28.992 89.504-24.384-7.808-28.896z m0-721.408l-89.504 24.288 7.904 28.896 7.808 28.896 89.504-24.288-7.808-28.896z m89.504-24.288l7.904 28.896 7.808 28.896 20-5.504v20.8h59.904V64z m35.712 193.376v120.288h59.904V283.392h-29.888z m0 240.704v120.288h59.904v-120.288h-29.888zM541.888 230.4l35.712-9.696-15.616-57.792-50.016 13.6L97.952 64v783.488L511.968 960l65.6-17.792-15.616-57.792-20 5.408v-114.592l35.712-9.696-15.712-57.792-20 5.408v-303.104l35.712-9.696-15.712-57.792-20 5.408V230.464z m-59.776 659.392L157.92 801.696V142.304L482.112 230.4v117.6l-192-52.192v427.296l192 52.192v114.496z m0-360.896v184.288l-132.192-35.904v-303.104l132.192 35.904v118.784z" p-id="2802"></path></svg>
                        </div>
                        <div class="text-xs mt-1">模板</div>
                    </div>
                </div>
                <div @click="tabClick('text')" class="w-full text-center cursor-pointer py-4" :class="{'bg-cus-lightActive': activeTab == 'text'}">
                    <div class="w-10 m-auto">
                        <div class="flex justify-center">
                            <svg t="1676388909632" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5635" width="28" height="28"><path d="M750.933333 340.053333c-0.443733-18.3808-7.202133-33.826133-20.599466-47.240533-12.834133-12.834133-27.733333-19.3024-45.533867-19.7632L685.6704 238.933333c26.606933 0.682667 49.749333 10.683733 68.795733 29.7472 19.6096 19.626667 29.917867 43.349333 30.600534 70.519467l-34.133000 0.853333z m-477.866666 0l-34.133000-0.853333c0.6656-27.0336 10.615467-50.705067 29.525334-70.2976 20.0192-19.3536 43.6736-29.2864 70.741333-29.952l0.853333 34.116267c-18.500267 0.4608-34.013867 6.997333-47.445333 19.968-12.561067 13.021867-19.080533 28.535467-19.541333 47.018666z" p-id="5636"></path><path d="M938.666667 955.733333h-85.333000a17.066667 17.066667 0 1 1 0-34.133333h68.266667v-68.266667a17.066667 17.066667 0 1 1 34.133333 0v85.333000a17.066667 17.066667 0 0 1-17.066666 17.066666z m-170.666667 0h-85.333333a17.066667 17.066667 0 1 1 0-34.133333h85.333333a17.066667 17.066667 0 1 1 0 34.133333z m-170.666667 0h-85.333333a17.066667 17.066667 0 1 1 0-34.133333h85.333333a17.066667 17.066667 0 1 1 0 34.133333z m-170.666666 0h-85.333000a17.066667 17.066667 0 1 1 0-34.133333h85.333000a17.066667 17.066667 0 1 1 0 34.133333z m-170.666667 0h-85.333333a17.066667 17.066667 0 1 1 0-34.133333h85.333333a17.066667 17.066667 0 1 1 0 34.133333zM85.333333 870.4a17.066667 17.066667 0 0 1-17.066666-17.066667v-85.333333a17.066667 17.066667 0 1 1 34.133333 0v85.333333a17.066667 17.066667 0 0 1-17.066667 17.066667z m853.333000-85.333333a17.066667 17.066667 0 0 1-17.066667-17.066667v-85.333333a17.066667 17.066667 0 1 1 34.133333 0v85.333333a17.066667 17.066667 0 0 1-17.066666 17.066667z m-341.333000 0H426.666667a17.066667 17.066667 0 1 1 0-34.133000h170.666666a17.066667 17.066667 0 1 1 0 34.133000zM85.333333 699.733333a17.066667 17.066667 0 0 1-17.066666-17.066666v-85.333000a17.066667 17.066667 0 1 1 34.133333 0v85.333000a17.066667 17.066667 0 0 1-17.066667 17.066666z m853.333000-85.333333a17.066667 17.066667 0 0 1-17.066667-17.066667v-85.333333a17.066667 17.066667 0 1 1 34.133333 0v85.333333a17.066667 17.066667 0 0 1-17.066666 17.066667zM85.333333 529.066667a17.066667 17.066667 0 0 1-17.066666-17.066667v-85.333333a17.066667 17.066667 0 0 1 34.133333 0v85.333333a17.066667 17.066667 0 0 1-17.066667 17.066667z m853.333000-85.333000a17.066667 17.066667 0 0 1-17.066667-17.066666v-85.333000a17.066667 17.066667 0 1 1 34.133333 0v85.333000a17.066667 17.066667 0 0 1-17.066666 17.066666zM85.333333 358.4a17.066667 17.066667 0 0 1-17.066666-17.066667v-85.333333a17.066667 17.066667 0 0 1 34.133333 0v85.333333a17.066667 17.066667 0 0 1-17.066667 17.066667z m682.666667-1.706667a17.066667 17.066667 0 0 1-17.066667-17.066666V273.066667H273.066667v66.56a17.066667 17.066667 0 0 1-34.133000 0V256a17.066667 17.066667 0 0 1 17.066667-17.066667h512a17.066667 17.066667 0 0 1 17.066667 17.066667v83.626667a17.066667 17.066667 0 0 1-17.066667 17.066666zM938.666667 273.066667a17.066667 17.066667 0 0 1-17.066667-17.066667v-85.333333a17.066667 17.066667 0 1 1 34.133333 0v85.333333a17.066667 17.066667 0 0 1-17.066666 17.066667zM85.333333 187.733333a17.066667 17.066667 0 0 1-17.066666-17.066666V85.333333a17.066667 17.066667 0 0 1 17.066666-17.066666h85.333000a17.066667 17.066667 0 0 1 0 34.133333H102.4v68.266667a17.066667 17.066667 0 0 1-17.066667 17.066666z m768-85.333333h-85.333333a17.066667 17.066667 0 1 1 0-34.133333h85.333333a17.066667 17.066667 0 1 1 0 34.133333zM682.666667 102.4h-85.333000a17.066667 17.066667 0 1 1 0-34.133333h85.333000a17.066667 17.066667 0 1 1 0 34.133333zM512 102.4h-85.333333a17.066667 17.066667 0 0 1 0-34.133333h85.333333a17.066667 17.066667 0 1 1 0 34.133333zM341.333333 102.4h-85.333333a17.066667 17.066667 0 0 1 0-34.133333h85.333333a17.066667 17.066667 0 0 1 0 34.133333z" p-id="5637"></path><path d="M477.866667 256h68.266666v512h-68.266666z" p-id="5638"></path></svg>
                        </div>
                        <div class="text-xs mt-1">特效字</div>
                    </div>
                </div>
                <div @click="tabClick('material')" class="w-full text-center cursor-pointer mt-2 py-4" :class="{'bg-cus-lightActive': activeTab == 'material'}">
                    <div class="w-10 m-auto">
                        <div class="flex justify-center">
                            <svg t="1676388985508" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6680" width="28" height="28"><path d="M509.8 808.5c-12.8 0-25.6-3.2-37-9.3l-0.2-0.1-0.2-0.1-300.1-163.9L83 680c-13.8 7.2-19.2 24.2-12.1 37.9 2.6 4.9 6.6 9 11.5 11.7l414.1 226c4.1 2.2 8.7 3.4 13.4 3.4 4.6 0 9.2-1.1 13.2-3.4l418.6-226c9.2-4.9 14.9-14.5 14.8-24.7-0.2-10.4-6-19.9-15.2-24.7l-89.6-45.6-304.5 164.3c-11.3 6.3-24.2 9.6-37.4 9.6z" fill="#272635" p-id="6681"></path><path d="M954.6 495c-0.7-1.8-1.5-3.5-2.5-5.1-2.6-4.3-6.4-7.9-11-10.3L851.5 434 660.3 537.2l-113.1 61.1c-11.3 6.3-24.2 9.6-37.4 9.6-12.8 0-25.6-3.2-37-9.3l-0.2-0.1-0.2-0.1-109.2-59.6-190.9-104.3-89.3 45c-9.9 5.2-15.5 15.4-15.2 25.8 0 0.5 0 0.9 0.1 1.4 0.1 0.9 0.2 1.7 0.3 2.5l0.3 1.5c0.5 2.3 1.3 4.5 2.4 6.6 1.5 2.8 3.5 5.4 5.9 7.6l2.1 1.8c1.1 0.8 2.3 1.6 3.5 2.3l144.1 78.7 36.4 19.9 233.5 127.5c4.1 2.2 8.7 3.4 13.4 3.4 4.6 0 9.2-1.1 13.2-3.4l274.4-148.2 80-43.2 64.2-34.7c0.8-0.4 1.5-0.9 2.2-1.3 7.9-5.2 12.7-14 12.6-23.4-0.1-3.2-0.7-6.4-1.8-9.3z" fill="#272635" p-id="6682"></path><path d="M82.3 328.4l414.1 226c4.1 2.2 8.7 3.4 13.4 3.4 4.6 0 9.2-1.1 13.2-3.4l418.6-226c9.2-4.9 14.9-14.5 14.8-24.7-0.2-10.4-6-19.9-15.2-24.7L526.8 68c-7.9-4-17.3-4-25.2 0L82.9 278.8C69.1 286 63.7 303 70.8 316.7c2.6 4.9 6.6 9 11.5 11.7z" fill="#272635" p-id="6683"></path></svg>
                        </div>
                        <div class="text-xs mt-1">素材</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full">
            <div class="w-full h-screen" v-if="activeTab == 'template'">
                <div class="px-2 pt-2">
                    <el-input
                        v-model="templateQueryModel"
                        class="w-full"
                        placeholder="输入查询内容"
                        @change="templateQueryChange()"
                        :prefix-icon="Search"
                    />
                </div>
                <div class="w-full flex flex-wrap overflow-auto scroll_content_auto"  @scroll="templateScroll" ref="templateScrollContainer" style="height: calc(100% - 40px)">
                    <div class="w-1/2 px-2 mt-4" v-for="(item,index) in templateList" v-bind:key="index" @click="addTemplate(item.source)">
                        <img :src="item.source.preview" class="w-full rounded cursor-pointer hover:shadow-2xl rounded shadow"/>
                    </div>
                    <div v-if="templateQueryLoading" class="w-full flex justify-center">
                        <lottie-player
                            loop
                            autoplay
                            style="width:100px"
                            src="/lottie/loading.json"
                            speed="1"
                        />
                    </div>
                    <div v-if="(templateList.length) > 0 && !templateQueryState.meta.hasNext" class="w-full text-center text-gray-300 my-8 text-xs">- 没有更多了 -</div>
                    <div v-if="(templateList.length) == 0 && !templateQueryState.meta.hasNext" class="w-full text-center text-gray-300 my-8 text-xs">- 没有数据 -</div>
                </div>
            </div>
            <div class="w-full flex flex-wrap" v-if="activeTab == 'text'">
                <div class="px-2 pt-2 w-full">
                    <el-input
                        v-model="textQueryModel"
                        class="w-full"
                        placeholder="输入查询内容"
                        @change="textQueryChange()"
                        :prefix-icon="Search"
                    />
                </div>
                <div class="w-full flex flex-wrap overflow-auto scroll_content_auto"  @scroll="textScroll" ref="textScrollContainer" style="height: calc(100% - 40px)">
                    <div class="w-1/2 px-2 mt-4" v-for="(item,index) in textList" v-bind:key="index" @click="addText(item.source)">
                        <div class="bg-cus-gf9 w-full h-full flex items-center cursor-pointer rounded hover:shadow-2xl rounded">
                            <img :src="item.source.preview" class="w-full rounded"/>
                        </div>
                    </div>
                    <div v-if="textQueryLoading" class="w-full flex justify-center">
                        <lottie-player
                            loop
                            autoplay
                            style="width:100px"
                            src="/lottie/loading.json"
                            speed="1"
                        />
                    </div>
                    <div v-if="(textList.length) > 0 && !textQueryState.meta.hasNext" class="w-full text-center text-gray-300 my-8 text-xs">- 没有更多了 -</div>
                    <div v-if="(textList.length) == 0 && !textQueryState.meta.hasNext" class="w-full text-center text-gray-300 my-8 text-xs">- 没有数据 -</div>
                </div>
            </div>
            <div class="w-full flex flex-wrap overflow-auto h-screen" v-if="activeTab == 'material'">
                <div class="px-2 pt-2 w-full">
                    <el-input
                        v-model="materialQueryModel"
                        class="w-full"
                        placeholder="输入查询内容"
                        @change="materialQueryChange()"
                        :prefix-icon="Search"
                    />
                </div>
                <div class="w-full flex flex-wrap overflow-auto scroll_content_auto"  @scroll="materialScroll" ref="materialScrollContainer" style="height: calc(100% - 40px)">
                    <div class="w-1/2 px-2 mt-4" v-for="(item,index) in materialList" v-bind:key="index" @click="addMaterial(item.source)">
                        <div class="bg-cus-gf9 w-full flex items-center cursor-pointer rounded hover:shadow-2xl rounded">
                            <img :src="item.source.preview" class="w-full rounded"/>
                        </div>
                    </div>
                    <div v-if="materialQueryLoading" class="w-full flex justify-center">
                        <lottie-player
                            loop
                            autoplay
                            style="width:100px"
                            src="/lottie/loading.json"
                            speed="1"
                        />
                    </div>
                    <div v-if="(materialList.length) > 0 && !materialQueryState.meta.hasNext" class="w-full text-center text-gray-300 my-8 text-xs">- 没有更多了 -</div>
                    <div v-if="(materialList.length) == 0 && !materialQueryState.meta.hasNext" class="w-full text-center text-gray-300 my-8 text-xs">- 没有数据 -</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import {
    ElInput,
} from "element-plus";
import { Search } from '@element-plus/icons-vue'
import eventBus from '~/assets/js/lib/eventBus'

// 模板
const templateQueryModel = ref("")
const templateQueryLoading = ref(false)
const templateQueryState = reactive({meta: {limit: 10, next: 0, hasNext: true}, active: "input"})
// const templateList = ref([
//         {
//             source: {preview: "http://localhost:3000/template/preset/template-230001.png", json: {
//                 "attrs": {
//                 "width": 279.2134831460674,
//                 "height": 497,
//                 "scaleX": 0.9979919678714859,
//                 "scaleY": 0.9979919678714859
//                 },
//                 "className": "Stage",
//                 "children": [
//                 {
//                     "attrs": {},
//                     "className": "Layer",
//                     "children": [
//                     {
//                         "attrs": {
//                         "width": 280,
//                         "height": 498,
//                         "name": "image",
//                         "draggable": true,
//                         "imageSource": "http://localhost:3000/template/20230129.jpg"
//                         },
//                         "className": "Image"
//                     },
//                     {
//                         "attrs": {
//                         "enabledAnchors": [
//                             "middle-left",
//                             "middle-right"
//                         ]
//                         },
//                         "className": "Transformer"
//                     },
//                     {
//                         "attrs": {
//                         "x": 72.96611297095083,
//                         "y": 30.8611670020121
//                         },
//                         "className": "Transformer"
//                     },
//                     {
//                         "attrs": {
//                         "x": 25.90712443890237,
//                         "y": 30.861167002012067,
//                         "text": "想\n\n都\n是\n问\n题",
//                         "fontFamily": "font23001",
//                         "fill": "rgba(0, 0, 0, 1)",
//                         "fontSize": 30,
//                         "draggable": true
//                         },
//                         "className": "Text"
//                     },
//                     {
//                         "attrs": {
//                         "x": 76.9711332715507,
//                         "y": 29.85915492957749,
//                         "text": "做\n\n都\n是\n答\n案",
//                         "fontFamily": "font23001",
//                         "fill": "#000000",
//                         "fontSize": 30,
//                         "draggable": true
//                         },
//                         "className": "Text"
//                     }
//                     ]
//                 }
//                 ]
//             }
//         }
//     }
// ])

const templateList = ref([])

// text
const textQueryModel = ref("")
const textQueryLoading = ref(false)
const textQueryState = reactive({meta: {limit: 10, next: 0, hasNext: true}, active: "input"})

const textList = ref([
    {
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/preview/text_preview_2023021101.png?imageView2/2/w/200",
            "config": [
            {
                "x": 100,
                "y": 100,
                "text": "双击编辑文字",
                "fontFamily": "font23002",
                "fill": "#000000",
                "fontSize": 30,
                "draggable": true
            }
            ]
        },
        "title": "标题粗体",
        "objectId": "63edaf32dee2d65eea84255d"
        },
        {
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/preview/text_preview_2023021102.png?imageView2/2/w/200",
            "config": [
            {
                "x": 100,
                "y": 100,
                "text": "双击编辑文字",
                "fontFamily": "font23002",
                "fill": "#000000",
                "fontSize": 18,
                "draggable": true
            }
            ]
        },
        "title": "正文普通",
        "objectId": "63edb0f4dee2d65eea8425c2"
        },
        {
        "title": "描边镂空粗体",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/preview/text_preview_2023020701.png?imageView2/2/w/200",
            "config": [
            {
                "y": 100,
                "stroke": "#3C5EF3",
                "fillAfterStrokeEnabled": true,
                "fill": "#ffffff",
                "draggable": true,
                "strokeWidth": 7,
                "x": 100,
                "fontSize": 30,
                "text": "描边"
            }
            ]
        },
        "objectId": "63edb16ddee2d65eea8425de"
        },
        {
        "title": "质感背景填充粗体",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/preview/text_preview_2023020702.png?imageView2/2/w/200",
            "config": [
            {
                "x": 100,
                "y": 100,
                "text": "质感",
                "fontSize": 30,
                "fontFamily": "font23001",
                "draggable": true,
                "fillPatternImage": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/fill/text_bg_23020701.png"
            }
            ]
        },
        "objectId": "63edb1b7017ba14d4fac6634"
        },
        {
        "title": "渐变颜色填充",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/preview/text_preview_2023020703.png?imageView2/2/w/200",
            "config": [
            {
                "y": 100,
                "fillLinearGradientStartPoint": {
                "x": 0,
                "y": 0
                },
                "fillLinearGradientEndPoint": {
                "x": 150,
                "y": 150
                },
                "fontFamily": "font23002",
                "draggable": true,
                "x": 100,
                "fontSize": 30,
                "fillLinearGradientColorStops": [
                0,
                "#fd2d79",
                1,
                "#febe52"
                ],
                "text": "双击编辑文字"
            }
            ]
        },
        "objectId": "63edb1eb017ba14d4fac663b"
        },
        {
        "title": "叠加力量粗体",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/preview/text_preview_2023020704.png?imageView2/2/w/200",
            "config": [
            {
                "x": 102,
                "y": 102,
                "text": "力量",
                "fontSize": 30,
                "fill": "#FFEF00"
            },
            {
                "x": 100,
                "y": 100,
                "text": "力量",
                "fontSize": 30,
                "fill": "#000000"
            }
            ]
        },
        "objectId": "63edb266dee2d65eea842605"
        },
        {
        "title": "青春粗体阳光",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/preview/text_preview_2023020705.png?imageView2/2/w/200",
            "config": [
            {
                "x": 100,
                "y": 100,
                "text": "青春",
                "fontFamily": "font23001",
                "fontSize": 30,
                "draggable": true,
                "fillPatternImage": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/text/preview/fill/text_bg_2023020901.png"
            }
            ]
        },
        "objectId": "63edb28f017ba14d4fac6674"
        }
])


// material
const materialQueryModel = ref("")
const materialQueryLoading = ref(false)
const materialQueryState = reactive({meta: {limit: 10, next: 0, hasNext: true}, active: "input"})
const materialList = ref([
    {
        "title": "daydaymoment标志Logo",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/material/daydaymoment.png??imageView2/2/w/200",
            "url": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/material/daydaymoment.png?imageslim"
        }
    },
    {
        "title": "太空火箭上升宇航员",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/material/2023020615.png?imageView2/2/w/200",
            "url": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/material/2023020615.png?imageslim"
        }
    },
    {
        "title": "撒花开心小女孩可爱",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/material/2023020619.png?imageView2/2/w/200",
            "url": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/material/2023020619.png?imageslim"
        }
    },
    {
        "title": "日历便签提示工作",
        "source": {
            "preview": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/material/2023020620.png?imageView2/2/w/200",
            "url": "https://daluobo.oss-cn-beijing.aliyuncs.com/template/material/2023020620.png?imageslim"
        }
    }
])

// const materialList = ref([])

const activeTab = ref("")

const tabClick = (active) => {
    activeTab.value = active
    if (active == "template") {
        if (templateList.value.length == 0) {
            templateQuerySelect(true)
        }
    } else if (active == "material") {
        if (materialList.value.length == 0) {
            materialQuerySelect(true)
        }
    } else if (active == "text") {
        if (textList.value.length == 0) {
            textQuerySelect(true)
        }
    }
}

// 预制模板的搜索：关键字查询
const templateQuerySelect = async (initFlag) => {
    if (templateQueryLoading.value) return false
    if (!templateQueryState.meta.hasNext) return false

    // 重置搜索内容
    if (initFlag) {
        templateQueryState.meta = {limit: 10, next: 0, hasNext: true}
        templateList.value = []
    }

    let params = {limit: templateQueryState.meta.limit, next: templateQueryState.meta.next}
    params["input"] = templateQueryModel.value
    templateQueryLoading.value = true
    const result = await axios.get(`/api/item/template`, { params })
    if (result.status == 200 && result.data.data) {
        templateList.value = templateList.value.concat(result.data.data)
        templateQueryState.meta = result.data.meta
    }
    templateQueryLoading.value = false
}

const templateQueryChange = async () => {
    templateQueryState.meta = {limit: 10, next: 0, hasNext: true}
    templateQuerySelect(true)

}

const templateScrollContainer = ref(null)
const templateScroll = async () => {
    let scrollHeight = templateScrollContainer.value.scrollHeight;
    let clientHeight = templateScrollContainer.value.clientHeight;
    let scrollTop = templateScrollContainer.value.scrollTop;
    if(scrollHeight - (scrollTop+clientHeight) <= 1 ) {
        templateQuerySelect()
    }
}

// material
// 素材的搜索：关键字查询
const materialQuerySelect = async (initFlag) => {
    if (materialQueryLoading.value) return false

    if (!materialQueryState.meta.hasNext) return false

    // 重置搜索内容
    if (initFlag) {
        materialQueryState.meta = {limit: 10, next: 0, hasNext: true}
        materialList.value = []
    }

    let params = {limit: 10, next: materialQueryState.meta.next}
    params["input"] = materialQueryModel.value
    materialQueryLoading.value = true
    const result = await axios.get(`/api/item/material`, { params })
    console.log("result::", result)
    if (result.status == 200 && result.data.data) {
        materialList.value = materialList.value.concat(result.data.data)
        materialQueryState.meta = result.data.meta
    }
    materialQueryLoading.value = false
}
const materialQueryChange = async () => {
    materialQueryState.meta = {limit: 10, next: 0, hasNext: true}
    materialQuerySelect(true)
}

const materialScroll = async () => {
    let scrollHeight = materialScrollContainer.value.scrollHeight;
    let clientHeight = materialScrollContainer.value.clientHeight;
    let scrollTop = materialScrollContainer.value.scrollTop;
    if(scrollHeight - (scrollTop+clientHeight) <= 1 ) {
        materialQuerySelect()
    }
}
const addMaterial = (item:any) => {
    eventBus.emit('addTemplate', {type: "material", params: item})
}

// text
// 文字的搜索：关键字查询
const textQuerySelect = async (initFlag) => {
    if (textQueryLoading.value) return false
    if (!textQueryState.meta.hasNext) return false

    // 重置搜索内容
    if (initFlag) {
        textQueryState.meta = {limit: 10, next: 0, hasNext: true}
        textList.value = []
    }

    let params = {limit: textQueryState.meta.limit, next: textQueryState.meta.next}
    params["input"] = textQueryModel.value
    textQueryLoading.value = true
    const result = await axios.get(`/api/item/text`, { params })
    if (result.status == 200 && result.data.data) {
        textList.value = textList.value.concat(result.data.data)
        textQueryState.meta = result.data.meta
    }
    textQueryLoading.value = false
}

const textQueryChange = async () => {
    textQueryState.meta = {limit: 10, next: 0, hasNext: true}
    textQuerySelect(true)
}

const textScrollContainer = ref()
const textScroll = async () => {
    let scrollHeight = textScrollContainer.value.scrollHeight;
    let clientHeight = textScrollContainer.value.clientHeight;
    let scrollTop = textScrollContainer.value.scrollTop;
    if(scrollHeight - (scrollTop+clientHeight) <= 1 ) {
        textQuerySelect()
    }
}

const addText = (item:any) => {
    eventBus.emit('addTemplate', {type: "text", params: item})
}


const addTemplate = (item: any) => {
    eventBus.emit('addTemplate', {type: "template", params: item.json})
}

tabClick('template')

</script>
