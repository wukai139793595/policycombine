<template>
    <div class="policy">
        <!-- <div class="head">
            <div class="turn-back">
                <img src="../assets/icon/left-direction.png" alt="">
            </div>
            <div class="title">购买保险</div>
        </div> -->
        <ls-head :headName="headName"/>
        <div class="scroll-wrap">
            <scroll @refresh="refresh" @loadmore="loadmore">
                <div class="group-wrap">
                    <div class="group-list" v-for="(item,index) in groupArr" :key="index">
                        <div class="name-wrap">
                            <div class="group-name">
                                {{item.groupname}}
                            </div>
                            <div class="group-info">
                                <span>总人数：{{item.apply}}人，</span>
                                <span>未交保险：{{item.apply-item.policy}}人</span>
                            </div>
                        </div>
                        <div class="look-buy">
                            <div class="look-btn" @click="toLookPolicy($event, index)">
                                查看
                            </div>
                            <div class="buy-btn" @click="toBuyPolicy($event, index)">
                                购买
                            </div>
                        </div>
                    </div>
                </div>        
            </scroll>
        </div>
        <div class="noGroup" v-if="groupArr.length===0">
            目前没有赛事小组
        </div>
    </div>
</template>
<script>
import lsHead from '@/components/lsHead.vue'
import Scroll from '@/components/scroll.vue'
import {postGroup, postCheckOrder} from '@/api/api.js'
import {changeLocationReplace} from '@/util/index.js'
export default {
    data () {
        return {
            headName: '购买保险',
            page: 1, //当前加载到第几页
            limit: 12,
            total: 0,  //总数量
            totalPage: 1, //总页数
            isClock: false, //网络请求锁 
            groupArr:[
        //         {
        //         "event_group_id":"20058", //小组id
        //         "groupname":"I",  //小组名
        //         "ROW_NUMBER":"1",
        //         "apply":3,  //报名人数
        //         "policy":1  //已保险人数
        //         },
        //         {
        //         "event_group_id":"20059",
        //         "groupname":"甲组",
        //         "ROW_NUMBER":"2",
        //         "apply":0,
        //         "policy":0
        //         }
           ]
        }
    },
    methods: {
        // 获取赛事小组
        initData () {
            this.isClock = true;
            postGroup({
                event_id: this.eventID,   //需替换成参数
                page: this.page,
                limit: this.limit,
                ssid: this.ssid
            })
            .then((res) => {
                this.isClock = false;
                console.log("policy",res)
                if (res.data.errcode === 0) {
                    var data = res.data.list;
                    this.total = res.data.total;
                    this.totalPage = res.data.totalPage;
                    this.groupArr.push(...data);                
                }else {
                    this.$message.error(res.data.msg)
                }
            })
            .catch((err) => {
                this.$message.error('网络错误')
            })
        },
        // 下拉刷新
        refresh () {
            this.page = 1;
            this.groupArr = [];
            this.initData();
        },
        //上拉加载
        loadmore (func) {
            if(this.groupArr.length >= this.total) {
                func(true);
            }else{
                if (!this.isClock) {
                    this.page += 1;
                    this.initData();
                }
                func();
            }
        },
        toBuyPolicy (event, index) {
            var groupId = this.groupArr[index].event_group_id;
            var startTime = this.groupArr[index].begintime;
            var endTime = this.groupArr[index].endtime;
            if (sessionStorage.getItem('groupId')) {
                if (sessionStorage.getItem('groupId') != groupId) {
                    sessionStorage.setItem('groupId', groupId);
                    sessionStorage.removeItem('sessionSelectArr');
                    sessionStorage.removeItem('startTime');
                    sessionStorage.removeItem('endTime');
                    sessionStorage.removeItem('isSelectAll');
                    sessionStorage.removeItem('selectedPolicy');
                }
            } else {
                sessionStorage.setItem('groupId', groupId);

            }
            postCheckOrder({
                group_id: groupId,
                ssid: this.ssid
            }).then(res => {
                console.log('checkOrder',res);
                if (res.data.errcode === 99999) {
                    // this.$route.meta.list = {
                    //     "policy_holderd_card": "330324199610168172",  //投保人证件号
                    //     "policy_holderd_name": "刘忠良",  //投保人姓名
                    //     "policy_holderd_sex": "1",  //投保人性别 1男 2女
                    //     "policy_holderd_card_type": 1,  //投保人证件类型 1:身份证;3:护照;10:港澳通行证;26:台湾居民往来内地通行证;
                    //     "policy_holderd_tel": "13868637383",  //投保人电话
                    //     "policy_holderd_email": "1249384402@qq.com",  //投保人邮箱
                    //     "relation": 5,  //投保人与被保人关系 0--本人,1--配偶,2--父母,3--子女,5--兄弟姐妹,6--祖父母、外祖父母,7--雇佣,9--其他
                    //     "start_date": "2019-03-06 00:00:00.000",  //保险开始时间
                    //     "end_date": "2019-03-07 00:00:00.000",  //保险结束时间
                    //     "order_id": "2019030514465416128550",  //订单号
                    //     "total_amount": "12.00",  //金额
                    //     "row_number": "1"                        
                    // }
                    // this.$route.meta.count = 3;
                    this.$route.meta.list = res.data.list;
                    this.$route.meta.count = res.data.count;
                    this.$router.push({
                        path: '/insurance/unpaid',
                        query: {
                            event_id: this.$route.query.event_id
                        }
                    })
                } else {
                    sessionStorage.setItem('startTime', startTime);
                    sessionStorage.setItem('endTime', endTime);
                    this.$router.push({
                        path: '/insurance/policyClassify',
                        query: {
                            groupId: groupId,
                            event_id: this.$route.query.event_id
                        }
                    })
                }
            }, err => {
                this.$message.error('网络错误')
            })

        },
        // 跳转到查看保险页面
        toLookPolicy (event, index) {
            let API_URL = location.protocol || 'http:';
            let groupId = this.groupArr[index].event_group_id;
            if (/^dev-/.test(location.hostname) || /^localhost/.test(location.hostname)) {
                API_URL += '//dev-'
            } else if (/^test-/.test(location.hostname)) {
                API_URL += '//test-'
            } else {
                API_URL += '//'
            }
            sessionStorage.setItem('insuranceGroupId',groupId);
            // changeLocationHref('m.yunbisai.com/insurance/insurance.html');
            if (location.hostname.indexOf('localhost') > -1) {
                window.location.href = 'http://localhost:8080/insurance.html';
            } else {
                window.location.href = API_URL + 'm.yunbisai.com/insurance/insurance.html';
            }
           
        }
    },
    components: {
        Scroll,
        lsHead
    },
    created () {
        // this.eventId = '1620' || window.parent.name ;
        if (this.$route.query.event_id) {
            this.eventID = this.$route.query.event_id;
        }
        console.log(this.eventID)
        this.ssid = this.$cookie.get('ssid');
        this.initData();
    }
}
</script>
<style lang="less">
.policy{
    width: 100%;
    height: 100%;
    .scroll-wrap{
        position: absolute;
        top: 80px;
        left: 0;
        right: 0;
        bottom: 0;
        .group-wrap{
            width: 702px;
            margin: 0 auto;
            box-sizing: border-box;
            padding: 40px 20px 0 20px;
            .group-list{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                box-sizing: border-box;
                padding-bottom: 30px;
                border-bottom: 2px solid #eee;
                .name-wrap{
                    text-align: left;
                    .group-name{
                        color: #333;
                        font-size: 30px; 
                    }
                    .group-info{
                        font-size: 28px; 
                        span{
                            color: #999;
                        }
                    }
                }
                .look-buy{
                    // display: flex;
                    // justify-content: space-between;
                    
                    .look-btn{
                        width: 70px;
                        height: 40px;
                        background-color: #eee;
                        margin-right: 20px;
                        display: inline-block;
                        line-height: 40px;
                        text-align: center;
                        font-size: 26px;
                    }
                    .buy-btn{
                        width: 100px;
                        height: 40px;
                        line-height: 40px;
                        font-size: 28px;
                        background-color: #3399ff;
                        color: #fff;
                        font-weight: bold;
                        text-align: center;
                        display: inline-block;
                    }

                }

            }
        }
    }
    .noGroup{
        text-align: center;
        font-size: 28px;
        color: #333;
        margin-top: 40px;
    }
}
</style>
