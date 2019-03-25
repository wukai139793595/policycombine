<template>
    <div class="search">
        <div class="wrapper">
            <div class="input-wrap">
                <img src="../assets/icon/search-icon.png" alt="" @click="toSearch($event)">
                <input type="text" placeholder="请输入姓名/小组/赛事" v-model="keywords" @keyup.enter='toSearch($event)'>
            </div>
            <div class="cancel" @click="toInsurance($event)">取消</div>
        </div>
        <div class="scroll-container">
            <scroll @refresh="refresh" @loadmore="loadmore">
                <div class="container">
                    <person-info 
                        v-for="(item, index) in insuranceList" :key='index'
                        @changeState='changeState(index)'
                        :insured_name='item.insured_name'
                        :state='item.state'
                        :title='item.title'
                        :groupname='item.groupname'
                        :start_date='item.start_date'
                        :end_date='item.end_date'
                        :real_amount='item.real_amount'
                        :order_id='item.order_id'
                        :insured_id='item.insured_id'
                        />
                </div>            
            </scroll>
        </div>
    </div>
</template>
<script>
import personInfo from '@/components/personInfo.vue'
import Scroll from '@/components/scroll.vue'
import {postQueryPolicy} from '@/api/insurance.js'
export default {
    data () {
        return {
            insuranceList:[],
            page: 1,
            limit: 10,
            total: 0,
            totalPage: 0 ,
            keywords: '',
            isClock: true         
        }
    },
    methods: {
        toSearch (event) {
            if (!this.keywords) {
                this.$message('请输入要搜索的内容');
                return
            }
            this.page = 1;
            this.insuranceList = [];
            this.initData();
        },
        initData () {
            //按页数进行查保
            this.isClock = true;
            postQueryPolicy({
                org_id: '32',
                entrance: 1,
                keywords: this.keywords.trim(),
                page: this.page,
                limit: this.limit,
                group_id: this.groupId || ""
            })
            .then((res) => {
                console.log(res)
                if (res.data.errcode === 0) {
                    this.total = res.data.total;
                    this.isClock = false;
                    this.totalPage = res.data.totalPage;
                    this.$nextTick(() => {
                        this.insuranceList.push(...res.data.list);
                        console.log('page:',this.page);
                        console.log('total:',this.total);
                        console.log('count:',this.insuranceList.length);
                    })
                } else {
                    this.$message.error(res.data.msg)
                }
            },(err) => {
                this.$message.error('网络错误')
            })
        },
        refresh () {
            this.page= 1,
            this.limit= 10,
            this.total= 0,
            this.totalPage= 0, 
            this.insuranceList = [];
            if (!this.keywords) {
                return
            }
            
            this.initData();
        },
        loadmore (func) {
            if (this.insuranceList.length < this.total) {
                
                if (!this.isClock) {
                    this.page += 1;
                    this.initData();
                }
                func();
            }else {
                
                func(true);
            }
        },
        toInsurance(event) {
            this.$router.go(-1);
        },
        changeState (index) {
            this.insuranceList[index].state = 3;
           
        }
    },
    components: {
        personInfo,
        Scroll
    },
    created () {
        this.groupId = this.$route.query.groupId;
    }
}
</script>
<style lang="less">
.search{
    width: 750px;
    height: 100%;
    position: absolute;
    .wrapper{
        width: 750px;
        height: 60px;
        box-sizing: border-box;
        padding: 0 24px;
        margin: 20px auto 60px auto;
        display: flex;
        justify-content: space-between;
        box-shadow: 2px 2px 2px #eee;
        .input-wrap{
            width: 500px;
            // background-color: #f6f6f6;
            img{
                width: 50px;
                height: 50px;
                margin-left: 20px;
                vertical-align: middle;
            }
            input{
                border: none;
                width: 400px;
                height: 50px;
                outline: none;
                margin-left: 20px;
                line-height: 50px;
                font-size: 24px; 

            }
            input::placeholder{
                color: #999;
                font-size: 24px; 
            }
        }
        .cancel{
            color: #3399ff;
            font-size: 26px;
        }
    }
    .scroll-container{
        position: absolute;
        top: 140px;
        bottom: 0;
        left: 0;
        right: 0;
        .container{
            width: 100%;
            height: 100%;
        }
    }
}
</style>
