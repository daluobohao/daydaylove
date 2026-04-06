<style scoped>
.section-yellow {
    background-color: #fff8f4;
}
.section-gray {
    background-color: #fafafa;
}
</style>
<template>
    <Nav class="section-yellow"/>
    <div class="w-full section-bg section-yellow pt-20">
        <div class="w-full max-w-screen-xl m-auto px-4 lg:px-10 pb-10 lg:pb-20 flex items-center flex-wrap">
            <div class="w-full lg:w-1/2">
                <h1 class="text-center lg:text-left text-3xl lg:text-5xl pt-10 lg:pt-20">真诚交友</h1>
                <div class="text-center lg:text-left mt-8 text-gray-600">简单，简洁，真实，高效</div>
                <div class="mt-10 flex flex-col lg:flex-row justify-center lg:justify-start">
                    <a class="bg-cus-active text-white px-4 py-3 rounded flex items-center justify-center w-48 m-auto lg:ml-0 lg:mr-0" href="/editor" target="_self">
                        <span class="ml-1">
                            免费使用
                        </span>
                    </a>
                </div>
            </div>
            <div class="w-full lg:w-1/2 lg:px-5">
                <img src="/svg/main.svg" class="max-w-screen-md m-auto">
            </div>
        </div>
    </div>
    <div class="w-full section-bg section-yellow">
        <div class="w-full max-w-screen-xl m-auto px-4 lg:px-10 py-20 flex items-center bg-yellow w-full flex-wrap text-center mb-6 lg:mb-0">
            <div class="w-full">
                <h2 class="text-3xl">如何使用</h2>
            </div>
            <div class="w-full flex flex-wrap mt-10 justify-center">
                <div class="w-full lg:w-4/12 flex items-center">
                    <div class="w-16 h-16 border-2 border-cus-active rounded-full flex items-center justify-center font-bold number">1</div>
                    <div class="ml-6 text-left">
                        <div class="font-bold text-xl">注册账号</div>
                        <div class="text-sm text-gray-600 mt-3">注册自己的专属账号</div>
                    </div>
                </div>
                <div class="w-full lg:w-4/12 flex items-center mt-6">
                    <div class="w-16 h-16 border-2 border-cus-active rounded-full flex items-center justify-center font-bold number">2</div>
                    <div class="ml-6 text-left">
                        <div class="font-bold text-xl">录入信息</div>
                        <div class="text-sm text-gray-600 mt-3">登录后进入好友专区录入个人交友信息</div>
                    </div>
                </div>
                <div class="w-full lg:w-4/12 flex items-center mt-6">
                    <div class="w-16 h-16 border-2 border-cus-active rounded-full flex items-center justify-center font-bold number">3</div>
                    <div class="ml-6 text-left">
                        <div class="font-bold text-xl">好友信息</div>
                        <div class="text-sm text-gray-600 mt-3">进入好友专区后办理会员，可查看更多找男女朋友的好友信息</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer></Footer>
</template>
