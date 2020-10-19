<template>
    <div>
        <el-dialog :visible.sync="value" fullscreen>
            <el-card shadow="never" style="border:0rem"  v-if="examData.singleList && examData.singleList.length > 0">
                <div style="text-align: center;margin-bottom: 30px">
                    <span>你的总分是:</span> <span style="color:red;font-weight: normal;font-size: 30px">{{studentResultArray.score.score}}</span>
<!--                    <count-to  :start-val="0" :end-val="studentResultArray.score.score" :duration="3000" class="count-to-class" style="color: red;font-weight: normal;font-size: 30px"></count-to>-->
                    <span>分</span>
                </div>

                <el-timeline>
                    <el-timeline-item :timestamp="'章节:【' + single.chapterName + '】,来源:【' + (single.sourced == '1' ? '课程试题' : (single.sourced == '2' ? '面试宝典' :'企业真题')) + '】'"  placement="top" v-for="(single,index) in examData.singleList" :key="single.id">
                        <el-card>
                            <div>
                                <el-tag type="success" style="margin:0px 10px 0px 0px">单选题{{ index + 1 }}</el-tag>
                                <h2 style="margin:0px 0px 20px 0px;display : inline-block">{{single.singleContent}}</h2>
                            </div>

                            <el-radio-group v-model="singleAskList[index]">
                                <el-radio label="1" style="margin:0px 0px 10px 0px" disabled>{{single.singleOptionA}}</el-radio><br/>
                                <el-radio label="2" style="margin:0px 0px 10px 0px" disabled>{{single.singleOptionB}}</el-radio><br/>
                                <el-radio label="3" style="margin:0px 0px 10px 0px" disabled>{{single.singleOptionC}}</el-radio><br/>
                                <el-radio label="4" style="margin:0px 0px 10px 0px" disabled>{{single.singleOptionD}}</el-radio><br/>
                            </el-radio-group>

                            <div>
                                <el-tag type="success">正确答案 : {{format_single(single.singleAsk)}}</el-tag>
                            </div>

                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-card>

            <el-card shadow="never" style="border:0rem"  v-if="examData.selectionList && examData.selectionList.length > 0">


                <el-timeline>
                    <el-timeline-item :timestamp="'章节:【' + selection.chapterName + '】,来源:【' + (selection.sourced == '1' ? '课程试题' : (selection.sourced == '2' ? '面试宝典' :'企业真题')) + '】'"  placement="top" v-for="(selection,index) in examData.selectionList" :key="selection.id">
                        <el-card>
                            <div>
                                <el-tag type="danger" style="margin:0px 10px 0px 0px">多选题{{ index + 1 }}</el-tag>
                                <h2 style="margin:0px 0px 20px 0px;display : inline-block">{{selection.selectionContent}}</h2>
                            </div>


                            <CheckboxGroup v-model="checkboxAskList[index]">
                                <Checkbox label="1" style="margin:0px 0px 10px 0px" disabled>
                                    <span>A. {{selection.selectionOptionA}}</span>
                                </Checkbox><br/>
                                <Checkbox label="2" style="margin:0px 0px 10px 0px" disabled>
                                    <span>B. {{selection.selectionOptionB}}</span>
                                </Checkbox><br/>
                                <Checkbox label="3" style="margin:0px 0px 10px 0px" disabled>
                                    <span>C. {{selection.selectionOptionC}}</span>
                                </Checkbox><br/>
                                <Checkbox label="4" style="margin:0px 0px 10px 0px" disabled>
                                    <span>D. {{selection.selectionOptionD}}</span>
                                </Checkbox><br/>
                            </CheckboxGroup>

                            <div>
                                <el-tag type="danger">正确答案 : {{format_selection(selection.selectionAsk)}}</el-tag>
                            </div>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-card>


            <el-card shadow="never" style="border:0rem"  v-if="examData.askList && examData.askList.length > 0">


                <el-timeline>
                    <el-timeline-item :timestamp="'章节:【' + ask.chapterName + '】,来源:【' + (ask.sourced == '1' ? '课程试题' : (ask.sourced == '2' ? '面试宝典' :'企业真题')) + '】'"  placement="top" v-for="(ask,index) in examData.askList" :key="ask.id">
                        <el-card>
                            <div>
                                <el-tag type="warning" style="margin:0px 10px 0px 0px">问</el-tag>
                                <h2 style="margin:0px 0px 20px 0px;display : inline-block">{{ask.askContent}}</h2>
                            </div>
                            <div>
                                <el-tag type="warning" style="margin:0px 10px 0px 0px">答</el-tag>
                                <h4 style="margin:0px 0px 20px 0px;display : inline-block">
                                    {{askList[index]}}
                                </h4>
                            </div>
                            <div>
                                <el-tag type="warning" style="margin:0px 10px 0px 0px">解</el-tag>
                                <font style="margin:0px 0px 20px 0px;display : inline-block;color:green">试题解析: {{ask.askAnalysis}}</font>
                            </div>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-card>
        </el-dialog>
    </div>
</template>

<script>

    import { findExamByDBHasAnswer,goBackStudentExamData } from "@/api/student/exam";

    export default {
        name: "exam-teacher-explain",
        data(){
            return {
                value : false,
                parentData:{},
                examData:{},
                singleAskList:[],
                checkboxAskList:[],
                askList:[],
                studentResultArray:{single:[],selection:[],ask:[],score:0}
            }
        },
        watch:{
            value(data){
                if(data){
                    findExamByDBHasAnswer(this.parentData).then(res=>{
                        if(res.data.success){
                            this.examData = res.data.data;
                        }
                    });

                    setTimeout(()=>{
                        goBackStudentExamData(this.parentData).then(res=>{
                            let { askResults ,selectionResults , singleResults,score} = res.data.data;
                            this.studentResultArray.ask = askResults;
                            this.studentResultArray.single = singleResults;
                            this.studentResultArray.selection = selectionResults;
                            this.studentResultArray.score = score;
                        });
                    },500)
                }
            },
            'studentResultArray.single'(data){
                if(data.length > 0){
                    this.singleAskList = [];
                    data.forEach(item=>{
                        if(item){
                            this.singleAskList.push(item.optionIds);
                        }
                    })
                }
            },
            'studentResultArray.selection'(data){
                if(data.length > 0){
                    this.selectionAskList = [];
                    data.forEach(item=>{
                       if(item){
                           this.selectionAskList.push(item.optionIds.split(","));
                       }
                    });
                }
            },
            'studentResultArray.ask'(data){
                if(data.length > 0){
                    this.askList = [];
                    data.forEach(item=>{
                       if(item){
                           this.askList.push(item.askAnswer);
                       }
                    })
                }
            }
        },
        methods:{
            format_selection(data){ //处理多选题答案的工具方法
                let array = [];

                if(data.includes("1")){ //1,3 A,C
                    array.push("A");
                }
                if(data.includes("2")){
                    array.push("B");
                }
                if(data.includes("3")){
                    array.push("C");
                }
                if(data.includes("4")){
                    array.push("D");
                }

                return array.join(",");
            },
            format_single(data){
                switch (data) {
                    case '1':
                        return "A";
                    case "2":
                        return "B";
                    case "3":
                        return "C";
                    case "4":
                        return "D";
                }
            }
        }
    }
</script>

<style scoped>

</style>