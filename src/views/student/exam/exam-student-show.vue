<template>
    <el-dialog :visible.sync="value" fullscreen center>

        <template slot="title">
            <h1>{{parentData.examName}}</h1>
            <el-button  style="" type="success" plain @click="handleSubmit">交卷</el-button>
        </template>

        <div>
            <el-card shadow="never" style="border:0rem"  v-if="examData.singleList && examData.singleList.length > 0">
                <el-timeline>
                    <el-timeline-item :timestamp="'章节:【' + single.chapterName + '】,来源:【' + (single.sourced == '1' ? '课程试题' : (single.sourced == '2' ? '面试宝典' :'企业真题')) + '】'"  placement="top" v-for="(single,index) in examData.singleList" :key="single.id">
                        <el-card shadow="never" style="border:0rem">
                            <div>
                                <el-tag type="success" style="margin:0px 10px 0px 0px">单选题{{ index + 1 }}</el-tag>
                                <h2 style="margin:0px 0px 20px 0px;display : inline-block">{{single.singleContent}}</h2>
                            </div>

                            <el-radio-group v-model="singleAskList[index]">
                                <el-radio label="1" style="margin:0px 0px 10px 0px">{{single.singleOptionA}}</el-radio><br/>
                                <el-radio label="2" style="margin:0px 0px 10px 0px">{{single.singleOptionB}}</el-radio><br/>
                                <el-radio label="3" style="margin:0px 0px 10px 0px">{{single.singleOptionC}}</el-radio><br/>
                                <el-radio label="4" style="margin:0px 0px 10px 0px">{{single.singleOptionD}}</el-radio><br/>
                            </el-radio-group>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-card>

            <el-card shadow="never" style="border:0rem"  v-if="examData.selectionList && examData.selectionList.length > 0">


                <el-timeline>
                    <el-timeline-item :timestamp="'章节:【' + selection.chapterName + '】,来源:【' + (selection.sourced == '1' ? '课程试题' : (selection.sourced == '2' ? '面试宝典' :'企业真题')) + '】'"  placement="top" v-for="(selection,index) in examData.selectionList" :key="selection.id">
                        <el-card shadow="never" style="border:0rem">
                            <div>
                                <el-tag type="danger" style="margin:0px 10px 0px 0px">多选题{{ index + 1 }}</el-tag>
                                <h2 style="margin:0px 0px 20px 0px;display : inline-block">{{selection.selectionContent}}</h2>
                            </div>

                            <CheckboxGroup v-model="checkboxAskList[index]">
                                <Checkbox label="1" style="margin:0px 0px 10px 0px">
                                    <span>A. {{selection.selectionOptionA}}</span>
                                </Checkbox><br/>
                                <Checkbox label="2" style="margin:0px 0px 10px 0px">
                                    <span>B. {{selection.selectionOptionB}}</span>
                                </Checkbox><br/>
                                <Checkbox label="3" style="margin:0px 0px 10px 0px">
                                    <span>C. {{selection.selectionOptionC}}</span>
                                </Checkbox><br/>
                                <Checkbox label="4" style="margin:0px 0px 10px 0px">
                                    <span>D. {{selection.selectionOptionD}}</span>
                                </Checkbox><br/>
                            </CheckboxGroup>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-card>


            <el-card shadow="never" style="border:0rem"  v-if="examData.askList && examData.askList.length > 0">


                <el-timeline>
                    <el-timeline-item :timestamp="'章节:【' + ask.chapterName + '】,来源:【' + (ask.sourced == '1' ? '课程试题' : (ask.sourced == '2' ? '面试宝典' :'企业真题')) + '】'"  placement="top" v-for="(ask,index) in examData.askList" :key="ask.id">
                        <el-card shadow="never" style="border:0rem">
                            <div>
                                <el-tag type="warning" style="margin:0px 10px 0px 0px">问答题{{ index + 1 }}</el-tag>
                                <h2 style="margin:0px 0px 20px 0px;display : inline-block">{{ask.askContent}}</h2>
                                <el-input type="textarea" placeholder="请输入你的答案" v-model="askList[index]"></el-input>
                            </div>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-card>


        </div>
    </el-dialog>
</template>
<script>

    import { findExamByCache } from '@/api/academic/exam.js'

    import { save,getExamStatus,saveTempAnswer,echoTempAnswer } from "@/api/student/exam";

    import { splice } from "@/utils/tools";

    export default {
        name: 'exam-teacher-show',
        data(){
            return {
                value: false,
                examData:{},
                parentData:{},
                singleAskList:[],
                checkboxAskList:[],
                askList:[],
                timer:'',
                saveTempAnswerTimer:''
            }
        },
        watch:{
            value(data){
                if(data){

                    //TODO: BUG:回显时追加
                    findExamByCache({id:this.parentData.id}).then(res=>{
                        if(res.data.success){
                            this.examData = res.data.data;
                        }
                        //页面渲染完成后,初始化
                        let askList = res.data.data.askList;
                        if(askList && askList.length > 0){
                            for(let i = 0 ; i < askList.length; i ++){
                                this.askList.push("");
                            }
                        }

                        let selectionList = res.data.data.selectionList;
                        if(selectionList && selectionList.length > 0){
                            for(let i = 0 ; i < selectionList.length ; i ++){
                                this.checkboxAskList.push(["5"]);
                            }
                        }

                        let singList = res.data.data.singleList;
                        if(singList && singList.length > 0){
                            for(let i = 0 ; i < singList.length ; i ++){
                                this.singleAskList.push("5");
                            }
                        }
                    });

                    //查询试卷状态, 如果为4则强制停止
                    this.timer = setInterval(()=>{
                        getExamStatus({id:this.parentData.id}).then(res=>{
                            if(res.data.data.examStatus != '2') {
                                this.submitExam();
                                //window.location.reload();
                            }
                        });
                    },1000 * 3 );

                    //保存临时答案
                    this.saveTempAnswerTimer = setInterval(()=>{
                        if(this.parentData && this.parentData.id){
                            //处理多选题数据
                            if(this.checkboxAskList && this.checkboxAskList.length > 0){
                                this.checkboxAskList.forEach(selectionArray=>{
                                    if(selectionArray.length > 1){
                                        selectionArray = splice(selectionArray);
                                    }
                                })
                            }
                            //处理问答题
                            let arr = [];
                            if(this.askList.length > 0){
                                this.askList.forEach(item=>{
                                    if(item == ""){
                                        arr.push("暂无答案");
                                    }else{
                                        arr.push(item);
                                    }
                                })
                            }
                            let data = {id:this.parentData.id,singleOptions:this.singleAskList.join(","),selectionOptions:this.checkboxAskList.join("@"),askOptions:arr.join("!&")};
                            saveTempAnswer(data);
                        }
                    },1000 * 5);

                    //数据回显
                    echoTempAnswer({id:this.parentData.id}).then(res=>{
                        if(res.data.success){
                            if(res.data && res.data.data){
                                //5,3,5,5,5#5@5@5@5@5#sdadad$&大声道撒大所多
                                let array = res.data.data.split("#");

                                if(array[0]){
                                    this.singleAskList = array[0].split(",");
                                }

                                if(array[1]){
                                    let arr = [];
                                    array[1].split("@").forEach(item=>{
                                       arr.push(item.split(","));
                                    });
                                    this.checkboxAskList = arr;
                                }

                                if(array[2]){
                                    let arr = [];
                                    array[2].split("!&").forEach(item=>{
                                        arr.push(item);
                                    });
                                    this.askList = arr;
                                }

                            }
                        }
                    });

                }
            }
        },
        methods:{
            submitExam(){
                //处理问答题
                let arr = [];
                if(this.askList.length > 0){
                    this.askList.forEach(item=>{
                        if(item == ""){
                            arr.push("暂无答案");
                        }else{
                            arr.push(item);
                        }
                    })
                }
                //处理多选题数据
                if(this.checkboxAskList && this.checkboxAskList.length > 0){
                    this.checkboxAskList.forEach(selectionArray=>{
                        if(selectionArray.length > 1){
                            selectionArray = splice(selectionArray);
                        }
                    })
                }

                clearInterval(this.timer);
                clearInterval(this.saveTempAnswerTimer);

                save({id:this.parentData.id,singleOptions:this.singleAskList.join(","),selectionOptions:this.checkboxAskList.join("@"),askOptions:arr.join("!&")}).then(res=>{
                    this.$message({
                        type:res.data.success ? 'success':'error',
                        message:res.data.message,
                        center:true
                    });

                    this.value = false;
                    this.$router.push({name:'student_exam'});
                    this.$parent.getList(this.$parent.params);
                });
            },
            handleSubmit(){
                this.$confirm("一旦交卷,则无法进入,你确定吗?","友情提示",{type:'warning'}).then(()=>{
                    this.submitExam();
                });
            }
        }
    }
</script>
<style scoped>

</style>