<template>
    <div class="w-full">
        <div class="flex items-center border-b py-1 px-4 text-xs" style="height: 43px;">
            <div class="w-8/12 flex items-center">
                <div>
                    <div :class="{'hidden': activeType != 'text'}" class="flex items-center">
                        <div>
                            <el-popover placement="bottom" :visible="visible" :width="200">
                                <template #reference>
                                    <div class="flex items-center">
                                        <div class="w-40 border px-2 flex items-center h-8 rounded cursor-pointer" @click.stop.prevent="visible = !visible"><img :src="activeFont.preview" class="w-full" v-if="activeFont.preview"/><span v-else>选择字体</span></div>
                                    </div>
                                </template>
                                <div v-for="item in options" :key="item.value" class="my-3 cursor-pointer" @click="selectFont(item)">
                                    <img :src="item.preview" class="w-full"/>
                                </div>
                            </el-popover>
                        </div>
                        <div class="ml-2">
                            <el-popover placement="bottom" :width="100" :visible="fontSizeVisible" :show-arrow="false">
                                <template #reference>
                                    <div class="">
                                        <el-input-number
                                            v-model="activeFontSize"
                                            :min="1"
                                            :max="200"
                                            controls-position="right"
                                            @click.stop.prevent="fontSizeClick"
                                            @change="fontSizeChange"
                                            />
                                    </div>
                                </template>
                                <div v-for="item in fontSizeOptions" :key="item" class="my-2 cursor-pointer" @click="selectFontSize(item)">
                                    <div>{{ item }}</div>
                                </div>
                            </el-popover>
                        </div>
                        <div class="ml-2 flex" v-if="activeColor.length > 0">
                            <div class="">
                                <el-color-picker v-model="selectedColor" show-alpha :predefine="predefineColors" @change="colorChange(0)"/>
                            </div>
                            <div class="ml-2" v-if="activeColor.length > 1">
                                <el-color-picker v-model="selectedColor2" show-alpha :predefine="predefineColors" @change="colorChange(1)"/>
                            </div>
                        </div>
                        <div class="ml-2 flex" v-if="activeFillPatternImage">
                            <el-popover placement="bottom" :visible="fillPatternImageVisible" :width="70">
                                <template #reference>
                                    <div class="flex items-center">
                                        <div class="w-28 p-2 cursor-pointer" @click.stop.prevent="fillPatternImageVisible = !fillPatternImageVisible"><img :src="activeFillPatternImage" class="w-28 h-6 cursor-pointer rounded" v-if="activeFillPatternImage"/></div>
                                    </div>
                                </template>
                                <div v-for="item in activeFillPatternImageOptions" :key="item.image" class="my-2 cursor-pointer" @click="selectPatternImage(item)">
                                    <img :src="item.image" class="w-28 h-8 m-auto rounded"/>
                                </div>
                            </el-popover>
                        </div>
                        <div class="ml-2 cursor-pointer" @click="actionForClone('text')">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="复制图层"
                                placement="bottom-start">
                                <svg t="1676390119649" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7769" width="32" height="32"><path d="M725.333333 341.333333h128v512H341.333333v-128H213.333333V213.333333h512v128z m0 42.666667v341.333333H384v85.333334h426.666667V384h-85.333334zM256 256v426.666667h426.666667V256H256z" fill="#444444" p-id="7770"></path></svg>
                            </el-tooltip>
                        </div>
                        <div class="ml-2 cursor-pointer" @click="zindexPopVisible = !zindexPopVisible">
                            <el-popover placement="bottom" popper-class="py-4 flex justify-center">
                                <template #reference>
                                    <div class="w-28 p-2 cursor-pointer" @click.stop.prevent="zindexPopVisible = !zindexPopVisible">
                                        <svg t="1677397879683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9798" width="20" height="20"><path d="M976 672c-6.496 0-12.688 1.328-18.352 3.664v-0.016l-0.208 0.08-0.208 0.08L512 860.048 66.784 675.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.08-0.016 0.016a48 48 0 0 0-36.704 88.656v0.016l463.584 191.824a1.12 1.12 0 0 0 0.208 0.08l0.208 0.08 0.016-0.016a47.6 47.6 0 0 0 36.688 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48 48 0 0 0 976 672zM29.664 348.336v0.016l463.584 191.824 0.208 0.08 0.208 0.08 0.016-0.016a47.456 47.456 0 0 0 36.672 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48.048 48.048 0 0 0 1024 304a48 48 0 0 0-29.648-44.336v-0.016L530.784 67.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.08-0.016 0.016a47.744 47.744 0 0 0-36.688-0.016l-0.016-0.016-0.208 0.08a1.12 1.12 0 0 1-0.208 0.08L29.648 259.648v0.016A48 48 0 0 0 0 304a48 48 0 0 0 29.664 44.336zM976 464c-6.496 0-12.688 1.328-18.352 3.664v-0.016l-0.208 0.096a1.12 1.12 0 0 1-0.208 0.08L512 652.048 66.784 467.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.096-0.016 0.016a48 48 0 0 0-36.704 88.672v0.016l463.584 191.824 0.208 0.08 0.208 0.08 0.016-0.016a47.6 47.6 0 0 0 36.688 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48 48 0 0 0 976 464z" fill="" p-id="9799"></path></svg>
                                    </div>
                                </template>
                                <div style="padding-bottom: 30px;" class="">
                                    <div class="text-xs text-center">置顶</div>
                                    <el-slider v-model="activeZindexPopValue" range vertical height="150px" show-stops :max="6"/>
                                    <div class="text-xs text-center">置底</div>
                                </div>
                            </el-popover>
                        </div>
                    </div>

                    <div class="flex items-center" :class="{'hidden': activeType != 'image'}">
                        <el-button type="" text @click="actionForImage('fit')">充满画布</el-button>
                        <el-button type="" text @click="actionForImage('crop')">裁剪</el-button>
                        <el-button type="" text @click="actionForImage('cropDone')">完成</el-button>
                        <div class="flex h-full items-center">
                            <el-upload
                                v-model:file-list="fileList"
                                ref="uploadRef"
                                class="flex items-center"
                                :data="{token:imageUploadContent.token}"
                                :on-success="handleUploadSuccess"
                                action="http://up-as0.qiniup.com"
                                accept="image/*"
                                :before-upload="onUploadChange"
                                >
                                <template #trigger>
                                    <el-button text>替换图片</el-button>
                                </template>
                                <template #tip>
                                </template>
                            </el-upload>
                        </div>
                        <div class="ml-2 cursor-pointer" @click="actionForClone('image')">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="复制图层"
                                placement="bottom-start">
                                <svg t="1676390119649" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7769" width="28" height="28"><path d="M725.333333 341.333333h128v512H341.333333v-128H213.333333V213.333333h512v128z m0 42.666667v341.333333H384v85.333334h426.666667V384h-85.333334zM256 256v426.666667h426.666667V256H256z" fill="#444444" p-id="7770"></path></svg>
                            </el-tooltip>
                        </div>
                        <div class="ml-2 cursor-pointer" @click="zindexPopVisible = !zindexPopVisible">
                            <el-popover placement="bottom" popper-class="py-4 flex justify-center">
                                <template #reference>
                                    <div class="w-28 p-2 cursor-pointer" @click.stop.prevent="zindexPopVisible = !zindexPopVisible">
                                        <svg t="1677397879683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9798" width="20" height="20"><path d="M976 672c-6.496 0-12.688 1.328-18.352 3.664v-0.016l-0.208 0.08-0.208 0.08L512 860.048 66.784 675.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.08-0.016 0.016a48 48 0 0 0-36.704 88.656v0.016l463.584 191.824a1.12 1.12 0 0 0 0.208 0.08l0.208 0.08 0.016-0.016a47.6 47.6 0 0 0 36.688 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48 48 0 0 0 976 672zM29.664 348.336v0.016l463.584 191.824 0.208 0.08 0.208 0.08 0.016-0.016a47.456 47.456 0 0 0 36.672 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48.048 48.048 0 0 0 1024 304a48 48 0 0 0-29.648-44.336v-0.016L530.784 67.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.08-0.016 0.016a47.744 47.744 0 0 0-36.688-0.016l-0.016-0.016-0.208 0.08a1.12 1.12 0 0 1-0.208 0.08L29.648 259.648v0.016A48 48 0 0 0 0 304a48 48 0 0 0 29.664 44.336zM976 464c-6.496 0-12.688 1.328-18.352 3.664v-0.016l-0.208 0.096a1.12 1.12 0 0 1-0.208 0.08L512 652.048 66.784 467.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.096-0.016 0.016a48 48 0 0 0-36.704 88.672v0.016l463.584 191.824 0.208 0.08 0.208 0.08 0.016-0.016a47.6 47.6 0 0 0 36.688 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48 48 0 0 0 976 464z" fill="" p-id="9799"></path></svg>
                                    </div>
                                </template>
                                <div style="padding-bottom: 30px;" class="">
                                    <div class="text-xs text-center">置顶</div>
                                    <el-slider v-model="activeZindexPopValue" range vertical height="150px" show-stops :max="6"/>
                                    <div class="text-xs text-center">置底</div>
                                </div>
                            </el-popover>
                        </div>

                    </div>
                </div>
            </div>

            <div class="w-4/12 flex items-center justify-end">

                <el-button color="#EB455F" class="cursor-pointer ml-2" type="danger" @click="downloadImage">
                    <svg t="1676391483587" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9521" width="16" height="16"><path d="M810.667 554.667l0 213.333-597.333 0 0-213.333-85.333 0 0 298.667 768 0 0-298.667z" p-id="9522" fill="#ffffff"></path><path d="M512 682.667l170.667-213.333-128 0 0-298.667-85.333 0 0 298.667-128 0z" p-id="9523" fill="#ffffff"></path></svg>
                    <span class="ml-1">下载</span>
                </el-button>

                <el-button @click="upgradeMembership" type="danger" v-if="!memberVerify">
                    会员
                </el-button>

                <div class="ml-4">
                    <el-dropdown @command="handleCommand">
                        <span class="flex items-center">
                            <span>{{ filterName(user.email) }}</span>
                            <span v-if="memberVerify" class="ml-1">
                                <svg t="1676988208534" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3087" width="16" height="16"><path d="M493.2 958.1c-6 0-11.7-2.8-15.4-7.6L32.6 370.4c-5.4-7-5.4-16.7 0-23.7L255.2 58.4c3.7-4.8 9.4-7.6 15.4-7.6h445.2c6 0 11.7 2.8 15.4 7.6l222.6 288.2c5.4 7 5.4 16.7 0 23.7L508.6 950.5c-3.6 4.8-9.3 7.6-15.4 7.6zM72.6 358.6l420.6 548.1 420.6-548.1L706.2 89.8h-426L72.6 358.6z" fill="#EB455F" p-id="3088"></path><path d="M919.6 382H66.8c-10.7 0-19.5-8.7-19.5-19.4 0-10.8 8.7-19.5 19.5-19.5h852.9c10.8 0 19.5 8.7 19.5 19.5-0.1 10.7-8.8 19.4-19.6 19.4z" fill="#EB455F" p-id="3089"></path><path d="M492.5 382c-0.1 0-0.1 0 0 0-6.1 0-11.8-2.9-15.5-7.7L255.1 82.1c-6.5-8.6-4.8-20.8 3.7-27.3 8.6-6.5 20.8-4.8 27.3 3.7l206.4 271.9L700.3 58.5c6.5-8.5 18.8-10.1 27.3-3.6 8.6 6.5 10.2 18.7 3.6 27.3L507.9 374.3c-3.7 4.9-9.4 7.7-15.4 7.7z" fill="#EB455F" p-id="3090"></path></svg>
                            </span>
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="myInfo" :icon="User">个人信息</el-dropdown-item>
                                <el-dropdown-item command="updradeMember" :icon="Present" v-if="memberVerify">升级会员</el-dropdown-item>
                                <el-dropdown-item command="exportToJSON" :icon="Document">导出配置</el-dropdown-item>
                                <el-dropdown-item command="quit" divided class="" :icon="SwitchButton">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <Membership :memberParams="memberDialogParams" v-on:memberListen="memberListen"></Membership>
        <el-dialog
            title="个人信息"
            v-model="myInfoDialogVisible">
            <div><span class="font-bold">登录邮箱：</span>{{ user.email }}</div>
            <div class="mt-4"><span class="font-bold">有效期至：</span> {{ new Date(member.expirationAt).toLocaleString().split(' ')[0] }}</div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import {
  ElButton,
  ElIcon,
  ElPopover,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElUpload,
  ElTooltip,
  ElDialog,
  ElSlider,
  ElInputNumber,
  ElColorPicker,
  ID_INJECTION_KEY
} from "element-plus";
import { ArrowDown, SwitchButton, Document } from '@element-plus/icons-vue'
import { getCookie, clearLocal } from "~/assets/js/utils/tools"
import axios from 'axios'
import eventBus from '~/assets/js/lib/eventBus'


const user = useState("user")

// MemberShip
const memberDialogParams = ref({flag: false, type: 1})
const member = useState("member")


const myInfoDialogVisible = ref(false)
const activeType = ref("")
const zindexPopVisible = ref(false)
const activeZindexPopValue= ref([0, 3])
const fileList = ref([])
const imageUploadContent = ref({token: "", imageUrl: ""})
const visible = ref(false)
const activeFont = ref({preview: ''})
const fontSizeVisible = ref(false)
const activeFontSize = ref()
const activeColor = ref([])
const selectedColor = ref('#ff4500')
const selectedColor2 = ref('#ffffff')
const predefineColors = ref([
  '#000000',
  '#ffffff',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  '#c7158577',
])
const activeColorType = ref("")
const fillPatternImageVisible = ref(false)
const activeFillPatternImage = ref("")
const fillPatternImageOptions = [{
    type: "zhigan",
    image: 'http://localhost:3000/template/text/fill/text_bg_23020701.png'
  }, {
    type: "zhigan",
    image: 'http://localhost:3000/template/text/fill/text_bg_23020702.png'
  }, {
    type: "zhigan",
    image: 'http://localhost:3000/template/text/fill/text_bg_23020703.png'
  }, {
    type: "zhigan",
    image: 'http://localhost:3000/template/text/fill/text_bg_23020704.png'
  }, {
    type: "zhigan",
    image: 'http://localhost:3000/template/text/fill/text_bg_23020705.png'
  }, {
    type: "qingchun",
    image: 'http://localhost:3000/template/text/fill/text_bg_2023020901.png'
  }, {
    type: "qingchun",
    image: 'http://localhost:3000/template/text/fill/text_bg_2023020902.png'
  }, {
    type: "qingchun",
    image: 'http://localhost:3000/template/text/fill/text_bg_2023020903.png'
  }, {
    type: "qingchun",
    image: 'http://localhost:3000/template/text/fill/text_bg_2023020904.png'
  }, {
    type: "qingchun",
    image: 'http://localhost:3000/template/text/fill/text_bg_2023020905.png'
  }]
  const activeFillPatternImageOptions = ref([])



const options = [{
    value: 'font23002',
    preview: '/font/preview/syht-heavy.svg'
  }, {
    value: 'fnsystSCHeavy',
    preview: '/font/preview/fnsystSCHeavy.svg'
  }, {
    value: 'font23001',
    preview: '/font/preview/pmzdbtt.svg'
  }, {
    value: 'zh167yrh',
    preview: '/font/preview/zh167yrh.svg'
  }, {
    value: 'zh53hyxt',
    preview: '/font/preview/zh53hyxt.svg'
  }
]
const fontSizeOptions = [12,14,16,18,20,24,28,30,40,50,60,70,90,100,150,200]

const filterName = (name) => {
    return name && name.split("@")[0]
}

const handleCommand = (command: string | number | object) => {
    if (command === 'quit') {
        clearLocal()
        window.location.href = "/";
    } else if (command === 'exportToJSON') {
        exportStageToJSON()
    } else if (command === 'updradeMember') {
        upgradeMembership()
    } else if (command === 'myInfo') {
        myInfoDialogVisible.value = true
    }
}

const selectPatternImage = (item) => {
    activeFillPatternImage.value = item.image
    fillPatternImageVisible.value = false
    eventBus.emit('edit', {type: "fillPatternImage", value: item.image})
}

nextTick(()=>{
    if (process.client) {
        window.addEventListener('click', () => {
            visible.value = false
            fontSizeVisible.value = false
            fillPatternImageVisible.value = false
        });
    }
})

// image upload
const handleUploadSuccess = async (res) => {
    const url = 'http://wang-hao-hao.cn/' + res.key + "?imageslim";
    eventBus.emit('edit', {type: "image", key: "replace", value: url})
}
const onUploadChange = async () => {
    let res = await axios.get(`/api/upload/sign`)
    imageUploadContent.value.token = res.data.token
}


const downloadImage = () => {
    eventBus.emit('edit', {type: "download"})
}

const onPreviewAction = (params:any) => {
    console.log("config:", params)
    if (params.type == "image") {
        activeType.value = "image"
    }  else if (params.type == "text") {
        let config = JSON.parse(params.config)
        activeType.value = "text"
        activeFontSize.value = config.attrs.fontSize
        activeColor.value = []
        activeColorType.value = ""
        activeFillPatternImage.value = ""
        activeZindexPopValue.value = config.attrs.zindex ? [0, config.attrs.zindex] : [0, 3]

        let fontFamily = config.attrs.fontFamily
        if (fontFamily) {
            let arr = options.filter(item => item.value == fontFamily)
            activeFont.value = arr[0]
        } else {
            activeFont.value = {'preview': ''}
        }

        let fillPatternImage = config.attrs.fillPatternImageSource
        let fillLinearGradientColorStops = config.attrs.fillLinearGradientColorStops
        if (fillPatternImage) { // 背景填充
            let items = fillPatternImageOptions.filter(item => fillPatternImage == item.image)
            let type = items[0].type
            activeFillPatternImageOptions.value = fillPatternImageOptions.filter(item => type == item.type)
            activeFillPatternImage.value = fillPatternImage
        } else if (fillLinearGradientColorStops) {
            selectedColor.value = fillLinearGradientColorStops[1]
            selectedColor2.value = fillLinearGradientColorStops[3]
            activeColor.value[0] = "0"
            activeColor.value[1] = "1"
            activeColorType.value = "fillLinearGradientColorStops"

        } else { // 文字颜色
            let fill = config.attrs.fill
            let stroke = config.attrs.stroke
            if (stroke) {
                selectedColor.value = stroke
                activeColor.value[0] = "stroke"
                if (fill) {
                    selectedColor2.value = fill
                    activeColor.value[1] = "fill"
                }
            } else if (fill) {
                selectedColor.value = fill
                activeColor.value[0] = "fill"
            }
        }


        visible.value = false
    }

}


watch(() => activeZindexPopValue.value, (first, second) => {
    if (first.length > 0 && second.length > 0) {
        if (first == 6) {
            eventBus.emit('edit', {type: "zindex", value: "top"})
        } else if (first == 1) {
            eventBus.emit('edit', {type: "zindex", value: "bottom"})
        } else if (first > second) {
            eventBus.emit('edit', {type: "zindex", value: "up"})
        } else if (first < second) {
            eventBus.emit('edit', {type: "zindex", value: "down"})
        }
    }
})

// 监听来自View组件的编辑事件
eventBus.on('edit2Bar', onPreviewAction)



// for image edit
const actionForImage = (action: String) => {
    eventBus.emit('edit', {type: "image", key: action})
}
const actionForClone = (action: String) => {
    eventBus.emit('edit', {type: "clone", value: action})
}

// font edit
const selectFont = (font) => {
    activeFont.value = font
    visible.value = false
    eventBus.emit('edit', {type: "font", value: font.value})
}
const fontSizeClick = (event) => {
    if (event.target.nodeName == 'INPUT') {
        fontSizeVisible.value = true
    }
}
const fontSizeChange = () => {
    fontSizeVisible.value = false
    eventBus.emit('edit', {type: "fontSize", value: activeFontSize.value})
}
const selectFontSize = (font) => {
    activeFontSize.value = font
    fontSizeChange()
}
const colorChange = (num) => {
    if (activeColorType.value == "fillLinearGradientColorStops") { // 渐变
        const arr = [0, selectedColor.value, 1, selectedColor2.value]
        eventBus.emit('edit', {type: "fillLinearGradientColorStops", value: arr})
    } else {
        if (num == 0) {
            eventBus.emit('edit', {type: activeColor.value[0], value: selectedColor.value})
        }
        if (num == 1) {
            eventBus.emit('edit', {type: activeColor.value[1], value: selectedColor2.value})
        }
    }

}

// menu part
const exportStageToJSON = () => {
    eventBus.emit('edit', {type: "export"})
}

// VIP
const memberVerify = computed(() => {
    console.log("member:", member.value)
    return member.value && member.value.verify
})
const upgradeMembership = async () => {
    memberDialogParams.value.flag = true
}
const memberListen = (params) => {
    if (params.type == "login") {
        memberDialogParams.value.flag = false
    } else if (params.type == "cancel") {
        memberDialogParams.value.flag = false
    }
}
</script>
