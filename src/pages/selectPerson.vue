<template>
    <div class="select-person">
        <!-- <div class="head">
            <div class="turn-back">
                <img src="../assets/icon/left-direction.png" alt="" @click="turnBack($event)">
            </div>
            <div class="title">请选择被保险的名单</div>
        </div>  -->
        <ls-head  :headName='headName'/>
        <div class="search-wrap">
            <img src="../assets/icon/search-icon.png" alt="" @click="toSearchPerson($event)">
            <input class="input" type="text" placeholder="搜索" v-model="inputValue" @keyup.enter='toSearchPerson($event)'>
        </div>
        <div class="scroll-wrap">
            <scroll @refresh="refresh" @loadmore="loadmore">
                <div class="person-wrap" >
                    <div class="person-list" v-for="(item,index) in noPolicyPerson" :key="index">
                        <div class="img-wrap">
                            <div class="img-box" @click="selectPerson($event, index)">
                                <img src="../assets/icon/choose-square.png" alt="" v-if="isSelectAll || hasSelect(item.idcard)">
                                <img src="../assets/icon/square.png" alt="" v-else>
                            </div>
                            <div class="name-wrap">
                                <div>{{item.name}}</div>
                                <div>身份证：{{item.idcard | identifiHide}}</div>
                            </div>
                        </div>
                        <div class="money-wrap">
                            需交：<span>{{oneCost | divisionHundred}}元</span>
                        </div>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="submit-wrap">
            <div class="select-all" @click="selectAll($event)">
                <img src="../assets/icon/choose-square.png" alt="" v-if="isSelectAll">
                <img src="../assets/icon/square.png" alt="" v-else>
                <span>全选</span>
            </div>
            <div class="select-info">
                <span>已选：{{personCount}}人</span>
                <span>合计：{{personCount | totalMoney(oneCost)}}元</span>
            </div>
            <div class="submit" @click="toWriteInfo($event)">
                购买
            </div>
        </div>
    </div>
</template>
<script>
import {postNoPolicyPerson} from '@/api/api.js'
import Scroll from '@/components/scroll.vue'
import lsHead from '@/components/lsHead.vue'
export default {
    data () {
        return {
            headName: '请选择被保险的名单',
            inputValue: '',
            isClock: false,
            page: 1,
            total: 0,
            limit: 20,
            oneCost: 0,           //每份保险金额，需除以100
            sessionSelectArr: [],
            noPolicyPerson: [
                // {    //未保险人员集合
                //     "group_id": 20058,
                //     "name": "阿萨德",
                //     "tel": "13666698009",
                //     "idcard": "asd4342323",
                //     "row_number": "1"
                // },
                // {
                //     "group_id": 20058,
                //     "name": "叶晓飞",
                //     "tel": "13478670738",
                //     "idcard": "332521197703260239",
                //     "row_number": "2"
                // }
            ],
            isSelectAll: false      //是否全选
        }
    },
    components: {
        Scroll,
        lsHead
    },
    computed: {
        selectArr() {    //客户选择要保险的人员
            return this.$store.state.selectArr
        },
        personCount () {
            if (this.isSelectAll) {
                return this.total;
            } else {
                return this.selectArr.length;
            }
        }
    },
    methods: {
        // 下拉刷新
        refresh () {
            this.page = 1;
            this.noPolicyPerson = [];
            this.getInfo();
        },
        //上拉加载
        loadmore (func) {
            if(this.noPolicyPerson.length >= this.total) {
                func(true);
            }else{
                if (!this.isClock) {
                    this.page += 1;
                    this.getInfo();
                }
                func();
            }
        },        
        // 获取赛事小组未保险人员
        getInfo () {
            postNoPolicyPerson({
                group_id: this.groupId,
                // group_id: '20058',  //注：正式应改成参数
                name: this.inputValue.trim(),
                page: this.page,
                limit: this.limit,
                ssid: this.ssid
            })
            .then((res) => {
                console.log(res)
                if (res.data.errcode === 0) {                   
                    this.noPolicyPerson.push(...res.data.list);
                    if (this.isSelectAll) {
                        this.$store.commit('changeUser',JSON.parse(JSON.stringify(this.noPolicyPerson)))
                    }
                    this.total = res.data.total;
                }else {
                    this.$message.error(res.data.msg)
                }
            })
            .catch((err) => {
                this.$message.error('网络错误')
            })
        },
        // getInfoAll () {
        //     this.noPolicyPerson = [];
        //     this.inputValue='';
        //     this.page=1;
        //     postNoPolicyPerson({
        //         group_id: this.groupId,
        //         // group_id: '20058',  //注：正式应改成参数
        //         name: this.inputValue.trim(),
        //         page: "",
        //         limit:'',
        //         ssid: this.ssid
        //     }).then(res => {
        //         if (res.data.errcode === 0) {
        //             this.noPolicyPerson=JSON.parse(JSON.stringify(res.data.list));
        //             this.total = res.data.total;
        //             sessionStorage.setItem('sessionSelectArr', JSON.stringify(res.data.list));
        //             sessionStorage.setItem('isSelectAll', true);
        //             this.$store.commit('changeUser', JSON.parse(JSON.stringify(res.data.list)));
        //             this.isSelectAll = true;
        //             // console.log(`selectArr:`,this.selectArr,`total:`,this.total);
        //         } else {
        //             this.$message.error(res.data.msg)
        //         }
        //     },err => {
        //         this.$message.error('网络错误')
        //     })
        // },
        initData() {
            this.ssid = this.$cookie.get('ssid');
            this.oneCost = this.$route.query.oneCost;
            this.groupId = this.$route.query.groupId;
            this.riskCode = this.$route.query.risk_code;
            var sessionSelectArr = [];
            if (sessionStorage.getItem('isSelectAll') === "true") {
                this.isSelectAll = true;
            } 
                
            if (sessionStorage.getItem('sessionSelectArr')) {
                     sessionSelectArr = JSON.parse(sessionStorage.getItem('sessionSelectArr'));
                     console.log(sessionSelectArr)
                    this.$store.commit('changeUser', sessionSelectArr);            
            } 
            

            this.getInfo();
            
        },
        selectPerson (event, index) {  //选择单个人操作
            let person = this.noPolicyPerson[index];
            let flag = false;   //是否已经选中
            let i = -1;
            for (let j = 0 ; j < this.selectArr.length ; j ++) {
                if (person.idcard === this.selectArr[j].idcard) {
                    i = j;
                    flag = true;
                    break;
                }   
            }
            if (flag) {
                this.selectArr.splice(i, 1);
                this.isSelectAll = false;
                sessionStorage.removeItem('isSelectAll');
            }else {
                this.selectArr.push(person);
                if (this.total === this.selectArr.length) {
                    this.isSelectAll = true;
                    sessionStorage.setItem('isSelectAll', true);
                }
            }
            console.log("noPolicyPerson",this.noPolicyPerson)
            console.log(this.selectArr)
            sessionStorage.setItem('sessionSelectArr', JSON.stringify(this.selectArr));
            this.$store.commit('changeUser', this.selectArr);
        },

        selectAll (event) {   //选择全部操作
            if (!this.isSelectAll) {
                this.isSelectAll = true;
                this.$store.commit('changeUser', JSON.parse(JSON.stringify(this.noPolicyPerson)))
                sessionStorage.setItem('sessionSelectArr', JSON.stringify(this.noPolicyPerson));
                sessionStorage.setItem('isSelectAll', true);

            } else {
                this.tempSelect = [];
                sessionStorage.removeItem('sessionSelectArr');
                sessionStorage.removeItem('isSelectAll');
                this.$store.commit('changeUser', [])
                this.isSelectAll = false;
                console.log(`selectArr:`,this.selectArr,`total:`,this.total);
            }
        },
        // 跳转到购买页
        toWriteInfo (event) {
            if (!this.selectArr.length) {
                this.$message('您还未选择要保险的名单');
                return
            }
            if (this.riskCode == 'EAC' && this.selectArr.length < 3) {
                this.$message('团体险需选择三人以上');
                return
            }
            this.$store.commit('changeMoney', this.totalMoney);
            this.$router.push({
                path: '/insurance/writeInfo',
                query: {
                    oneCost: this.$route.query.oneCost,
                    groupId: this.$route.query.groupId,
                    policyId: this.$route.query.policyId,
                    event_id: this.$route.query.event_id,
                    person_count: this.personCount
                }
            })
        },
        // 搜索成员
        toSearchPerson (event) {
            this.noPolicyPerson = [];       
            this.page = 1;
            console.log(this.inputValue)
            this.getInfo();   
        },
        turnBack (event) {
            this.$store.commit('changeUser',[]);
            this.$router.go(-1);
        },
        hasSelect (value) {
            var len = this.selectArr.length;
            for (let i = 0 ; i < len ; i ++) {
                if (this.selectArr[i].idcard === value) {
                    return true
                }
            }
            return false
        }
    },
    created () {
        this.initData();
    },
    filters: {
        divisionHundred (value) {   //每份金额要除以100
            return (Number(value)/100).toFixed(2);
        },
        totalMoney (value, oneCost) {   //合计金额
            return  (Number(oneCost)/100).toFixed(2) * value
        },
        identifiHide (value) {     //身份证显示****
            let temp = '';
            if(value && value.length > 4) {
                temp = value.substr(0, 2) + '******' + value.substr(-2, value.length);
            }
            return temp;
        }
        
    }
}
</script>
<style lang="less">
.select-person{
    width: 100%;
    height: 100%;
    position: relative;
    .search-wrap{
        width: 702px;
        height: 60px;
        line-height: 60px;
        background-color: #f6f6f6;
        margin: 40px auto 30px auto;
        border-radius: 30px;
        img{
            width: 30px;
            height: 30px;
            margin-left: 20px;
            position: relative;
            top: 4px;
        }
        input{
            width: 500px;
            height: 60px;
            line-height:60px;
            border: none;
            margin-left: 20px;
            background-color: #f6f6f6;
            outline: none;
            font-size: 28px;/*px*/
        }
        input::placeholder{
            color: #9999;
            font-size: 28px;/*px*/
        }
    }
    .scroll-wrap{
        position: absolute;
        top: 210px;
        left: 0;
        right: 0;
        bottom: 100px;
        .person-wrap{
            width: 702px;
            margin: 0 auto;
            padding-bottom: 80px;
            .person-list{
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding-bottom: 30px;
                margin-bottom: 30px;
                border-bottom: 2px solid #eee;
                .img-wrap{
                    display: flex;
                    .img-box{
                        width: 30px;
                        height: 30px;

                        img{
                            width:30px;
                            height: 30px;
                            position: relative;
                            top: 8px;
                        }
                    }
                    .name-wrap{
                        margin-left: 20px;
                        div:nth-of-type(1) {
                            font-size: 30px;/*px*/ 
                            color: #333;
                            margin-bottom: 8px;
                        }
                        div:nth-of-type(2) {
                            font-size: 28px;/*px*/ 
                            color: #666;
                        }
                    }
                }
                .money-wrap{
                    color: #666;
                    font-size: 28px;/*px*/ 
                    span{
                        color: #3399ff;
                        font-weight: bold;
                    }
                }
            }
        }
    }
    .submit-wrap{
        width: 750px;
        height: 100px;
        padding-left: 28px;
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #666;
        background-color: #fff;
        .select-all{
            img{
                width: 34px;
                height: 34px;
                position: relative;
                top: 4px;
                margin-right: 10px;
            }
            span{
                font-size: 28px;/*px*/
            }
        }
        .select-info{
            margin-left: -40px;
            span{
                font-size: 26px;/*px*/
            }
        }
        .submit{
            width: 180px;
            height: 100px;
            background-color: #3399ff;
            line-height: 100px;
            text-align: center;
            font-size: 30px;/*px*/ 
            color: #fff;
            font-weight: bold;
        }
    }
}
</style>
