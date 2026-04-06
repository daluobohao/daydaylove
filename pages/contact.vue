<style scoped>
.bg-yellow {
    background-color: #FFF8F2;
}
.section-bg {
    background: linear-gradient(180deg, #FFF8F2 0%, rgba(255,248,242,0.69) 100%);
}
p {
    margin: 20px 0px;
}
.safe-footer-space {
    padding-bottom: calc(112px + env(safe-area-inset-bottom));
}
</style>
<template>
 <div>
    <Nav class="bg-yellow"/>
    <div class="max-w-screen-xl m-auto px-4 lg:px-10 pt-10 pb-20 text-gray-500 mt-20 safe-footer-space">
        <div class="text-4xl text-black">沟通建议</div>
        <p>微信(请备注: daydaylove): tiankongfei12345</p>
    </div>
    <Footer class="fixed w-full bottom-0" style="padding-bottom: env(safe-area-inset-bottom);"></Footer>
 </div>
</template>

<script>
export default {
    name: "contact",
    head() {
        return {
            title: '联系我们',
        }
    }
}
</script>
