<template>
    <div>
        <el-dialog  fullscreen :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
            <el-form :model="data" label-position="right" label-width="80px">

                <el-row>
                    <el-col :span="24">
                        <el-alert :closable="false" style="margin:0px 0px 20px 0px" title="温馨提示: 请选择章节和试题类型后,点击筛选按钮查询数据" show-icon type="info" ></el-alert>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="chapterId" label="选择章节">
                            <el-select v-model="checkedChapterIdArray" multiple clearable filterable size="medium" placeholder="可多选,可搜索">
                                <el-option :label="item.name" :key="item.id" :value="item.id" v-for="item in chapterData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="questionTypeIds" label="试题类型">
                            <el-checkbox-group v-model="checkedQuestionTypeArray">
                                <el-checkbox label="1">单选题</el-checkbox>
                                <el-checkbox label="2">多选题</el-checkbox>
                                <el-checkbox label="3">问答题</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

                    <el-col :span="6"  v-if="searchData.singleList.length > 0">
                        <el-input type="text" v-model="params.name1" placeholder="请输入单选题题干"></el-input>
                    </el-col>
                    <el-col :span="2" v-if="searchData.singleList.length > 0">
                        <el-button type="success" plain @click="selectList1()"><i class="el-icon-loading"></i>查询</el-button>
                    </el-col>
                    <el-col :span="6" v-if="searchData.selectionList.length > 0">
                        <el-input type="text" v-model="params.name2" placeholder="请输入单选题题干"></el-input>
                     </el-col>
                    <el-col :span="2" v-if="searchData.selectionList.length > 0">
                        <el-button type="success" plain @click="selectList2()"><i class="el-icon-loading"></i>查询</el-button>
                        </el-col>
                    <el-col :span="6" v-if="searchData.askList.length > 0">
                        <el-input type="text" v-model="params.name3" placeholder="请输入单选题题干"></el-input>
                     </el-col>
                    <el-col :span="2" v-if="searchData.askList.length > 0">
                        <el-button type="success" plain @click="selectList3()"><i class="el-icon-loading"></i>查询</el-button>
                    </el-col>

                </el-row>
    
                <el-row>
                    <Scroll height="600">
                        <!-- 单选题表格 -->
                        <el-col :span="8" v-if="!searchData.singleList || searchData.singleList.length > 0">
                            <el-table ref="table" :data="searchData.singleList" v-if="searchData.singleList && searchData.singleList.length > 0" @select-all="kong" @select="tableSelect">
                                <el-table-column type="selection" align="center"></el-table-column>
                                <el-table-column prop="chapterName"  width="200px" align="center" label="所属章节" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="singleContent" align="center" label="单选题题干" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-col>
                        <!-- 多选题表格 -->
                        <el-col :span="8">
                            <el-table ref="table" :data="searchData.selectionList" v-if="searchData.selectionList && searchData.selectionList.length > 0" @select-all="kong" @select="tableSelect">
                                <el-table-column type="selection" align="center"></el-table-column>
                                <el-table-column prop="chapterName"  width="200px" align="center" label="所属章节" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="selectionContent" align="center" label="多选题题干" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-col>
                        <!-- 问答题表格 -->
                        <el-col :span="8" >
                            <el-table ref="table" :data="searchData.askList" v-if="searchData.askList && searchData.askList.length > 0" @select-all="kong" @select="tableSelect">
                                <el-table-column type="selection" align="center"></el-table-column>
                                <el-table-column prop="chapterName"  width="200px" align="center" label="所属章节" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="askContent" align="center" label="问答题题干" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-col>
                    </Scroll>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button type="warning" plain @click="search" size="mini"><i class="el-icon-search"></i>查看数据库题量</el-button>
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
    name:'exam-no-auto-child',
    data(){
        return {
            params:{name:""},
            data:{},
            singleIds:[],
            selectionIds:[],
            askIds:[],
            value:false,
            chapterData:[],
            checkedChapterIdArray:[],  //选中的章节id数组
            checkedQuestionTypeArray:[], //选中的试题类型数组
            searchData:{
                singleList:[],
                selectionList:[],
                askList:[]
            }, //通过条件进行查询的数据对象,对象中包含: singleList,selectionList,askList
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
        }
    },
    methods:{

        selectList1(){
            //临时查询后数组
            let arr = [];
            //遍历所有的试题
            this.searchData.singleList.filter(item=>{
                if(this.params.name1){
                    //查询是否包含框框内的题干
                    if(item.singleContent.includes(this.params.name1)){
                        arr.push(item);
                    }
                }
            })
            //遍历给tables
            this.searchData.singleList = arr;
        },selectList2(){
            //临时查询后数组
            let arr = [];
            //遍历所有的试题
            this.searchData.selectionList.filter(item=>{
                if(this.params.name2){
                    //查询是否包含框框内的题干
                    if(item.selectionContent.includes(this.params.name2)){
                        arr.push(item);
                    }
                }
            })
            //遍历给tables
            this.searchData.selectionList = arr;
        },selectList3(){
            //临时查询后数组
            let arr = [];
            //遍历所有的试题
            this.searchData.askList.filter(item=>{
                if(this.params.name3){
                    //查询是否包含框框内的题干
                    if(item.askContent.includes(this.params.name3)){
                        arr.push(item);
                    }
                }
            })
            //遍历给tables
            this.searchData.askList = arr;
        },
        kong(selection){
			this.$message.error("禁止全部选择");
            
            this.$refs.table.clearSelection();

            //空方法
        },
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
                    this.dis = false;
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


            if(questionTypeIds.includes("1")){
                if(this.singleIds.length == 0){
                    this.$message.error("请选择试题");
                    return false;
                }
            }
            if(questionTypeIds.includes("2")){
                if(this.selectionIds.length == 0){
                    this.$message.error("请选择试题");
                    return false;
                }
            } 
            if(questionTypeIds.includes("3")){
                if(this.askIds.length == 0){
                    this.$message.error("请选择试题");
                    return false;
                }
            }


            this.data.chapterIds = this.checkedChapterIdArray.join(",");
            this.data.questionTypeIds = this.checkedQuestionTypeArray.join(",");


            //将单选题id组放到总集合中
            this.data.singleJoins=this.singleIds.join(",");
            this.data.selectionJoins=this.selectionIds.join(",");
            this.data.askJoins=this.askIds.join(",");
            this.data.singleCount = this.singleIds.length;
            this.data.askCount = this.askIds.length;
            this.data.selectionCount = this.selectionIds.length;

            //章节id,试题类型,试题id传到试卷页面

            this.$parent.noAutoExam = this.data;


            this.value = false;

        },
        tableSelect(selection,row){ //selection, 选中的对象集合
            //判断试题类型
            if(row.type == "1"){
                //this.singleIds.push(row.id);
                this.singleIds = selection.map(item=>{
                    return item.id
                })
            }else if(row.type == "2"){
                //this.selectionIds.push(row.id);
                this.selectionIds = selection.map(item=>{
                    return item.id
                })
            }else if(row.type == "3") {
                //this.askIds.push(row.id);

                this.askIds = selection.map(item=>{
                    return item.id
                })
            }

        }
    }
}
</script>
<style scoped>

</style>