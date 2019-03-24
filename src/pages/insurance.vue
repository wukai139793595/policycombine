<template>
    <div class="insurance">
        <div class="head">
            <div class="turn-back">
                <img src="../assets/icon/left-direction.png" alt="" @click="turnBack($event)">
            </div>
            <div class="title">
                保单管理
            </div>
            <div class="select" @click="selectShow($event)">
                <img src="../assets/icon/select-icon.png" alt="">
                <span>筛选</span>
            </div>
        </div>
        <div class="search">
            <div class="input" @click="toSearch($event)">
                <img src="../assets/icon/search-icon.png" alt="">
                <span>搜索</span>
            </div>
        </div>
        <div class="scroll-container">
            <scroll @refresh="refresh" @loadmore="loadmore" ref='myScroll'>
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
        <transition name="slide">
            <div class="select-content" v-if="isShow">
                <div class="mask" @click="selectShow($event)"></div>
                <div class="select-box">
                    <div class="select-hint">保险起止时间</div>
                    <div class="time-wrap">
                        <el-date-picker
                            class="data-picker"
                            v-model="startTime"
                            type="date"
                            :placeholder="today|moment('YYYY-MM-DD')"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"

                            >
                        </el-date-picker>
                        <!-- <div class="time-start">2019-02-18</div> -->
                        <span class="line"></span>
                        <el-date-picker
                            v-model="endTime"
                            type="date"
                            :placeholder="today|moment('YYYY-MM-DD')"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"

                            >
                        </el-date-picker>
                    </div>
                    <div class="status-hint">
                        状态
                    </div>
                    <div class="type-wrap">
                        <div v-for="(ele, ind) in selectList" :key="ind" :class="{isSelect: isSelectArr[ind] == state}" @click="selectChange($event, ind)">
                            {{selectList[ind]}}
                        </div>
                    </div>
                    <div class="btn-wrap">
                        <div class="reset" @click="toReset($event)">重置</div>
                        <div class="submit" @click="toSubmit($event)">确认</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import Scroll from '@/components/scroll.vue'
import personInfo from '@/components/personInfo.vue'
import Vue from 'vue'
import {postQueryPolicy,postPolicyCancel} from '@/api/insurance.js'
import {GetUrlParam} from '@/util/index.js'
export default {
    data () {
        return {
            startTime: '',
            endTime: '',
            isClock: true, //请求数据锁
            isShow: false,
            page: 1,
            limit: 10,
            total: 0,
            totalPage: 0,
            state: '',     
            // 设置不可选时间

            selectList: [
                '全部',
                '已交保',
                '已退保'
            ],
            isSelectArr: [
                '',
                '2',
                '3'
                // false,
                // true,
                // false
            ],
            insuranceList: [
                // {
                //     "policy_holderd_name":"刘忠良",//投保人姓名
                //     "state":2,//保单状态 1为待投保,2为成功,3为退保,4为失败
                //     "title":"退费测试赛1",  //赛事名
                //     "start_date":"2019-02-16 00:00:00.000",  //保险开始时间
                //     "end_date":"2019-02-17 00:00:00.000",  //保险结束时间
                //     "real_amount":1000,  //应付金额，实际金额为 real_amount/100
                //     "insured_name":"方亮"
                // },
                // {
                //     "policy_holderd_name":"刘忠良",//投保人姓名
                //     "state":3,//保单状态 1为待投保,2为成功,3为退保,4为失败
                //     "title":"退费测试赛1",  //赛事名
                //     "start_date":"2019-02-16 00:00:00.000",  //保险开始时间
                //     "end_date":"2019-02-17 00:00:00.000",  //保险结束时间
                //     "real_amount":1000,  //应付金额，实际金额为 real_amount/100
                //     "insured_name":"方亮"
                // },
                // {
                //     "policy_holderd_name":"刘忠良",//投保人姓名
                //     "state":2,//保单状态 1为待投保,2为成功,3为退保,4为失败
                //     "title":"退费测试赛1",  //赛事名
                //     "start_date":"2019-02-16 00:00:00.000",  //保险开始时间
                //     "end_date":"2019-02-17 00:00:00.000",  //保险结束时间
                //     "real_amount":1000,  //应付金额，实际金额为 real_amount/100
                //     "insured_name":"方亮"
                // },
                // {
                //     "policy_holderd_name":"刘忠良",//投保人姓名
                //     "state":3,//保单状态 1为待投保,2为成功,3为退保,4为失败
                //     "title":"退费测试赛1",  //赛事名
                //     "start_date":"2019-02-16 00:00:00.000",  //保险开始时间
                //     "end_date":"2019-02-17 00:00:00.000",  //保险结束时间
                //     "real_amount":1000,  //应付金额，实际金额为 real_amount/100
                //     "insured_name":"方亮"
                // }
            ]
        }
    },
    components: {
        Scroll,
        personInfo
    },
    methods: {

        initData () {
            //按页数进行查保
            this.isClock = true;
            postQueryPolicy({
                // org_id: '32',         //
                // entrance: 1,
                ssid: this.ssid,
                begin_time: this.startTime,
                end_time: this.endTime,
                state: this.state,
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
            // console.log('myScroll',this.$refs.myScroll)
            this.$refs.myScroll.$el.scrollTo(0,0);
            // this.$refs.myScroll.refreshDone();
            // this.$refs.myScroll.noMore = false;
            this.initData();
        },
        loadmore (func) {
            if (this.insuranceList.length > this.total ) {
                console.log("insuranceList.length:",this.insuranceList.length);
                console.log('total',this.total);
                func(true)
            } else {
                if (!this.isClock) {
                    this.page += 1;
                    this.initData();
                }
                func();                
            }
        },
        toSearch (event) {
            console.log(event)
            this.$router.push({
                path: '/search',
                query: {
                    groupId: this.groupId || ""
                }
            });
        },
        selectShow (event) {
            this.isShow = !this.isShow;
        },
        selectChange (event, index) {
            this.state = this.isSelectArr[index]
        },
        changeState (index) {
            this.insuranceList[index].state = 3;
            console.log('insurance',this.insuranceList[index].state)
        },
        // 重置按钮
        toReset (event) {
            this.state = '';
            this.startTime = '';
            this.endTime = '';
        },
        // 确认按钮
        toSubmit (event) {
            this.isShow = false;
            this.refresh();

        },
        //返回页面
        turnBack (event) {
            this.$router.go(-1);
        }
    },
    created () {
        this.today = Date.now();
        this.ssid = this.$cookie.get('ssid');
        // this.groupId = GetUrlParam("groupId").split('#')[0];
        this.groupId = sessionStorage.getItem('insuranceGroupId');
        console.log(this.groupId)
        this.initData();
    }
}
</script>
<style lang="less">
.insurance{
    width: 750px;
    height: 100%;
    position: relative;
    display: inline-block;
    .head{
        width: 750px;
        margin-left: auto;
        margin-right: auto;
        height: 60px;
        padding: 0 24px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        margin-bottom: 30px;
        box-shadow: 4px 4px 10px #eee;
        .turn-back{
            width: 40px;
            height: 40px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .title{
            font-size: 30px;
            color: #333;
        }
        .select{
            height: 100%;
            img{
                width: 40px;
                height: 40px;
                vertical-align: top;
            }
            span{
                font-size: 30px;
                color: #676767;
            }
        }
    }
    .search{
        width: 100%;
        height: 60px;
        margin-top: 10px;
        margin-bottom: 40px;
        box-sizing: border-box;
        position: relative;
        .input{
            width: 702px;
            height: 60px;
            margin: 0 auto;
            line-height: 60px;
            background-color: #f6f6f6;
            border-radius: 30px;
            img{
                position: relative;
                top: -4px;
                width: 40px;
                height: 40px;
                vertical-align: middle;
                margin-left: 40px;
            }
            span{
                font-size: 28px; 
                color: #999;
                margin-left: 20px;
            }
        }
    }
    .scroll-container{
        position: absolute;
        top: 200px;
        left: 0;
        right: 0;
        bottom: 0;
        .container{
            width: 100%;
            height: 100%;
            // .people-wrap{
            //     width: 702px;
            //     margin: 0 auto 40px;
            //     position: relative;
            //     .name-box{
            //         width: 100%;
            //         display: flex;
            //         justify-content: space-between;
            //         margin-bottom: 26px;
            //         .name{
            //             font-size: 30px; 
            //             font-weight: bold;
            //             color: #333;
            //         }
            //         .is-insurance{
            //             font-size: 24px; 
            //             color: #999;
            //         }
            //     }
            //     .competite-info{
            //         width: 100%;
            //         box-sizing: border-box;
            //         padding-left: 40px;
            //         font-size: 30px; 
            //         color: #666;
            //         margin-bottom: 30px;
            //         &>div{
            //             margin-bottom: 10px;
            //         }
            //     }
            //     .insurance-sum{
            //         span:nth-of-type(1){
            //             font-size: 26px;
            //             color: #999;
            //         }
            //         span:nth-of-type(2) {
            //             font-size: 28px;
            //             color: #333;
            //             font-weight: bold;
            //         }
            //     }
            //     .surrender-normal{
            //         position: absolute;
            //         bottom: 4px;
            //         right: 4px;
            //         width: 140px;
            //         height: 50px;
            //         background-color: #eee;
            //         border-radius: 25px;
            //         font-size: 32px;
            //         color: #666;
            //         text-align: center;
            //         line-height: 50px;
            //         font-weight: bold;
            //     }
            //     .surrender{
            //         background-color: #3399ff;   
            //         color: #fff;             
            //     }
            // }
        }
    }
    .slide-enter-active{
        transition:all 0.5s ease;
    }
     .slide-leave-active{
        transition:all 0.5s ease;
    }
    .slide-leave-to{
        transform: translateX(100%);
    }
    .slide-enter{
        transform: translateX(100%);
    }

    .select-content{
        width: 750px;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        display: flex;
        .mask{
            width: 100px;
            background-color: rgba(0,0,0,.6);
        }
        .select-box{
            flex: 1;
            background-color: #fff;
            padding-top: 50px;
            position: relative;
            .select-hint{
                color: #333;
                font-size: 30px; 
                font-weight: bold;
                text-indent: 40px;
            }
            .time-wrap{
                // width: 750px;
                width: 650px;
                margin-top: 30px;
                margin-bottom: 40px;
                display: flex;
                justify-content: space-around;
                .line{
                    width: 20px;
                    display: block;
                    position: relative;
                    // font-size: 40px;
                }
                .line::after{
                    content: '';
                    width: 100%;
                    height: 2px;
                    position: absolute;
                    top: 50%;
                    left: 0;
                    background-color: #666;
                }
                .el-date-editor{
                    background-color: #f4f4f4;
                    flex-shrink: 1;
                    .el-input__inner{
                        text-align: center;
                        // font-size: 26px;
                        color: #666;
                        padding-left: 0;
                        padding-right: 0;
                    }
                }
                // div{
                //     width: 40%;
                //     height: 60px;
                //     border-radius: 30px;
                //     line-height: 60px;
                //     color: #666;
                //     font-size: 26px;
                //     background-color: #f4f4f4;
                //     text-align: center;
                // }
            }
            .status-hint{
                font-size: 30px; 
                color: #333;
                font-weight: bold;
                text-indent: 40px;
            }
            .type-wrap{
                display: flex;
                justify-content: space-around;
                margin-top: 30px;
                div{
                    width: 160px;
                    height: 60px;
                    font-size: 30px;
                    color: #666;
                    background-color: #f4f4f4;
                    border-radius: 30px;
                    text-align: center;
                    line-height: 60px;
                    letter-spacing: 4px;
                }
                .isSelect{
                    background-color: #3399ff;
                    color: #fff;
                }
            }
        }
        .btn-wrap{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            display: flex;
            div{
                width: 50%;
                height: 100px;
                line-height: 100px;
                text-align: center;
                font-size: 30px; 
            }
            .reset{
                border-top: 2px solid #e5e5e5;
                color: #666;

            }
            .submit{
                background-color: #3399ff;
                color: #fff;
            }

        }
    }
}
</style>
