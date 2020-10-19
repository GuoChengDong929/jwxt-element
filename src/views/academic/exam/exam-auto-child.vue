<template>
    <div>
        <el-dialog  :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="false">
            <el-form :model="data" label-position="right" label-width="80px">

                <el-alert :closable="false" style="margin:0px 0px 20px 0px" title="温馨提示: 请选择章节和试题类型后,点击筛选按钮查询数据" show-icon type="info" ></el-alert>
                <el-alert :closable="false" style="margin:0px 0px 20px 0px" :title="'单选题'+ count.single +'道,多选题' + count.selection + '道,问答题' + count.ask + '道....请按照题目数量给出相应正确的出题数量'" show-icon type="info"></el-alert>
          
                <el-row>
                    <el-col :span="10">
                        <el-form-item prop="chapterId" label="选择章节">
                            <el-select v-model="checkedChapterIdArray" multiple clearable filterable size="medium" placeholder="可多选,可搜索">
                                <el-option :label="item.name" :key="item.id" :value="item.id" v-for="item in chapterData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="questionTypeIds" label="试题类型">
                            <el-checkbox-group v-model="checkedQuestionTypeArray">
                                <el-checkbox label="1">单选题</el-checkbox>
                                <el-checkbox label="2">多选题</el-checkbox>
                                <el-checkbox label="3">问答题</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4"> 
                        <el-button type="warning" plain @click="search" size="mini"><i class="el-icon-search"></i>查看数据库题量</el-button>
                    </el-col>
                </el-row>
            
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="singleCount" label="单选数量">
                            <el-input-number v-model="data.singleCount" :min="0" :max="50" placeholder="单选题数量"></el-input-number>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="singleScore" label="单选分数">
                            <el-input-number v-model="data.singleScore" :min="0" :max="50" placeholder="单题分数"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="selectionCount" label="多选数量">
                            <el-input-number v-model="data.selectionCount" :min="0" :max="50" placeholder="多选题数量"></el-input-number>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="selectionScore" label="多选分数">
                            <el-input-number v-model="data.selectionScore" :min="0" :max="50" placeholder="多选分数"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="askCount" label="问答数量">
                            <el-input-number v-model="data.askCount" :min="0" :max="50" placeholder="问答题数量"></el-input-number>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="askScore" label="问答分数">
                            <el-input-number v-model="data.askScore" :min="0" :max="50" placeholder="问答分数"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button type="info" plain @click="$parent.exam.examPattern = '',value = false" size="mini"><i class="el-icon-bell"></i>取消</el-button>
                <el-button type="success" plain @click="ok" size="mini"><i class="el-icon-loading"></i>提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>

import { findChapters } from '@/api/academic/chapter.js'

import { getQuestionsByChapterIdsAndQuestionTypeIds } from '@/api/academic/question.js'

export default {
    name:'exam-auto-child',
    data(){
        return {
            data:{},
            value:false,
            chapterData:[],
            checkedChapterIdArray:[],
            checkedQuestionTypeArray:[],
            searchData:{}, //通过条件进行查询的数据对象,对象中包含: singleList,selectionList,askList
            count:{
                single:0,
                selection:0,
                ask:0
            }
        }
    },
    watch:{
        value(data){
            if(data){
                findChapters().then(res=>{
                    if(res.data.success){
                        this.chapterData = res.data.data;
                    }
                });
            }
        },
        searchData(data){
            if(data){
                if(data.singleList){
                    this.count.single = data.singleList.length;
                }
                if(data.selectionList){
                    this.count.selection = data.selectionList.length;
                }
                if(data.askList){
                    this.count.ask = data.askList.length;
                }
            }
        }
    },
    methods:{
        search(){
            if(this.checkedChapterIdArray.length == 0){
                this.$message.error("请选择章节");
                return false;
            }
            if(this.checkedQuestionTypeArray.length == 0){
                this.$message.error("请选择试题类型");
                return false;
            }

            let chapterIds = this.checkedChapterIdArray.join(",");
            let questionTypeIds = this.checkedQuestionTypeArray.join(",");

            getQuestionsByChapterIdsAndQuestionTypeIds({chapterIds:chapterIds,questionTypeIds:questionTypeIds}).then(res=>{
                if(res.data.success){
                    this.searchData = res.data.data;
                }
            });

        },
        ok(){
            if(this.checkedChapterIdArray.length == 0){
                this.$message.error("请选择章节");
                return false;
            }
            if(this.checkedQuestionTypeArray.length == 0){
                this.$message.error("请选择试题类型");
                return false;
            }

            let questionTypeIds = this.checkedQuestionTypeArray.join(",");

            let sum = 0;

            if(questionTypeIds.includes("1")){
                if(!this.data.singleCount){
                    this.$message.error("请给出单选题数量");
                    return false;
                }

                if(!this.data.singleScore){
                    this.$message.error("请给出单选题单题分数");
                    return false;
                }

                 if(this.data.singleScore <= 0){
                    this.$message.error("请给出正确的分数");
                    return false;
                }


                if(this.data.singleCount > this.count.single){
                    this.$message.error("单选题数量大于题库实际数量,请重新填写");
                    return false;
                }

                sum = sum + this.data.singleCount * this.data.singleScore;

            }

            if(questionTypeIds.includes("2")){
                if(!this.data.selectionCount){
                    this.$message.error("请给出多选题数量");
                    return false;
                }

                if(!this.data.selectionScore){
                    this.$message.error("请给出多选题单题分数");
                    return false;
                }

                 if(this.data.selectionScore <= 0){
                    this.$message.error("请给出正确的分数");
                    return false;
                }

                if(this.data.selectionCount > this.count.selection){
                    this.$message.error("多选题数量大于题库实际数量,请重新填写");
                    return false;
                }

                sum = sum + this.data.selectionCount * this.data.selectionScore;

            }

            if(questionTypeIds.includes("3")){
                if(!this.data.askCount){
                    this.$message.error("请给出问答题数量");
                    return false;
                }

                if(!this.data.askScore){
                    this.$message.error("请给出问答题单题分数");
                    return false;
                }

                if(this.data.askScore <= 0){
                    this.$message.error("请给出正确的分数");
                    return false;
                }

                if(this.data.askCount > this.count.ask){
                    this.$message.error("问答题数量大于题库实际数量,请重新填写");
                    return false;
                }

                sum = sum + this.data.askCount * this.data.askScore;
            }


            if(sum != 100){
                this.$message.error("总分不是100分,请重新给分");
                return false;
            }

            this.data.chapterIds = this.checkedChapterIdArray.join(",");
            this.data.questionTypeIds = this.checkedQuestionTypeArray.join(",");

            this.$parent.autoExam = this.data;

            this.value = false;

        }
    }
}
</script>
<style scoped>

</style>