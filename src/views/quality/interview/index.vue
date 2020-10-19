<template>
    <div>
        <el-card style="margin: 10px">
            <el-button type="success" plain icon="el-icon-push" @click="openWindow('interviewAdd')">增加访谈记录</el-button>
            <el-button type="success" plain icon="el-icon-phone" @click="openWindow2('interviewPast')">过往访谈</el-button>
            <el-button type="primary">温馨提示：您本月的访谈记录提交了<font style="color: red;font-size: 18px">{{data.length}}</font>次,距离考核标准还差<font style="color: red;font-size: 18px">{{5 - data.length <= 0 ? 0 : 5 - data.length}}</font>次</el-button>
        </el-card>
        <el-card style="margin: 10px">
            <p align="center" v-if="data.length == 0">暂无数据</p>
            <Scroll height="800" v-if="data.length > 0">
                <el-card style="margin: 15px;padding: 10px" v-for="item in data" :key="item.id">
                    <el-row>
                        <el-col :span="8" align="center">
                            <h3>{{item.studentName}}</h3>
                        </el-col>
                        <el-col :span="8" align="center">
                            <h3>{{item.classesName}}</h3>
                        </el-col>
                        <el-col :span="8" align="center">
                            <el-link type="danger" @click.native="openInterviewInfo(item,'interviewInfo')">进入</el-link>
                        </el-col>
                    </el-row>
                </el-card>
            </Scroll>
        </el-card>
    <interview-info ref="interviewInfo"></interview-info>
        <interview-add ref="interviewAdd"></interview-add>
        <interview-past ref="interviewPast"></interview-past>
    </div>
</template>

<script>

    import { findAll } from "../../../api/quality/interview/interview";
    import { getClassesListById } from '@/api/quality/transact/classes.js'

    export default {
        name: "index",
        components:{
          InterviewInfo:()=>import("@/views/quality/interview/interview_info.vue"),
            InterviewAdd:()=>import("@/views/quality/interview/interview_add.vue"),
            InterviewPast:()=>import("@/views/quality/interview/interview_past.vue")
        },
        data(){
            return{
                data:[],
                enVisible:'0'
            }
        },
        methods:{
            //过往访谈
            openWindow2(name){
                this.$refs[name].data = {};
                this.$refs[name].value = "过往访谈记录";
                this.$refs[name].dialogVisible = true;
            },
            //增加访谈记录
            openWindow(name){
                getClassesListById().then(res=>{
                    if(res.data.success){
                        this.$refs[name].classesList = res.data.data;
                        this.$refs[name].interview = {};
                        this.$refs[name].studentList = [];
                        this.$refs[name].selectClassesId = '';
                        this.$refs[name].dialogVisible = true;
                        this.$refs[name].value = '增加访谈记录';
                    }else{
                        this.$message.error(res.data.message);
                        return false;
                    }
                })
            },
            //查看详情
            openInterviewInfo(data,name){
                this.$refs[name].data = {};
                this.$refs[name].info = data;
                this.$refs[name].dialogVisible=true;
            },
            //查全部
            findAll(){
                findAll().then(res=>{
                    if(res.data.success){
                        this.data = res.data.data.interviews;
                        this.enVisible = res.data.data.enVisible;
                    }else{
                        this.$message.error(res.data.message);
                    }
                })
            }

        },
        created() {
            this.findAll();
        }
    }
</script>

<style scoped>

</style>