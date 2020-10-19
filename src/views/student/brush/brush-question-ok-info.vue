<template>
    <div>
        <el-dialog :visible.sync="value" :before-close="beforeCloseDialog" :close-on-click-modal="false" :close-on-press-escape="false" title="已答题">

            <el-alert type="warning" title="一旦切换选项卡,则之前勾选的复选框将被清空,请注意" :closable="false" style="margin-bottom: 20px"></el-alert>

            <el-tabs type="card" v-model="tabValue" stretch :before-leave="beforeLeave">
                <el-tab-pane label="单选题" name="1" >
                    <Scroll height="500">
                        <el-checkbox-group v-if="data.singleList.length > 0" v-model="checkbox" :key="single.id" v-for="single in data.singleList">
                            <el-checkbox style="margin-bottom: 10px" :label="single.id" >{{handleContent(single.singleContent)}}</el-checkbox><br />
                        </el-checkbox-group>
                    </Scroll>
                </el-tab-pane>
                <el-tab-pane label="多选题" name="2">
                    <Scroll height="500">
                        <el-checkbox-group v-if="data.selectionList.length > 0"  v-model="checkbox" :key="selection.id" v-for="selection in data.selectionList">
                            <el-checkbox style="margin-bottom: 10px" :label="selection.id" >{{handleContent(selection.selectionContent)}}</el-checkbox><br />
                        </el-checkbox-group>
                    </Scroll>
                </el-tab-pane>
                <el-tab-pane label="问答题" name="3">
                    <Scroll height="500">
                        <el-checkbox-group v-if="data.askList.length > 0" v-model="checkbox" :key="ask.id" v-for="ask in data.askList">
                            <el-checkbox style="margin-bottom: 10px" :label="ask.id" >{{handleContent(ask.askContent)}}</el-checkbox><br />
                        </el-checkbox-group>
                    </Scroll>
                </el-tab-pane>
                <el-tab-pane label="上机题" name="4">
                    <Scroll height="500">
                        <el-checkbox-group v-if="data.upperList.length > 0" v-model="checkbox" :key="upper.id" v-for="upper in data.upperList">
                            <el-checkbox style="margin-bottom: 10px" :label="upper.id" >{{handleContent(upper.upperContent)}}</el-checkbox><br />
                        </el-checkbox-group>
                    </Scroll>
                </el-tab-pane>
            </el-tabs>

            <template slot="footer">
                <el-button plain type="danger" @click="outOk"><i class="el-icon-delete"></i>移除</el-button>
            </template>

        </el-dialog>
    </div>
</template>

<script>

    import { removeOk } from "@/api/student/prush";

    export default {
        name: "brush-question-ok-info",
        data(){
            return {
                value : false,
                data:[],
                chapter:{},
                tabValue:'1',
                checkbox:[]
            }
        },
        methods:{
            beforeCloseDialog(){
                this.value = false;
            },
            handleContent(data){
                return data.length > 30 ? data.substr(0,30) : data;
            },
            beforeLeave(activeName,oldActiveName){
                if(activeName == '1'){
                    if(this.data.singleList.length  == 0){
                        this.$message.error("没有单选题");
                        return false;
                    }else{
                        this.checkbox = [];
                    }
                }else if(activeName == '2'){
                    if(this.data.selectionList.length  == 0){
                        this.$message.error("没有多选题");
                        return false;
                    }else{
                        this.checkbox = [];
                    }
                }else if(activeName == '3'){
                    if(this.data.askList.length  == 0){
                        this.$message.error("没有问答题");
                        return false;
                    }else{
                        this.checkbox = [];
                    }
                }else if(activeName == '4'){
                    if(this.data.upperList.length  == 0){
                        this.$message.error("没有上机题");
                        return false;
                    }else{
                        this.checkbox = [];
                    }
                }

            },
            outOk(){
                if(this.checkbox.length == 0){
                    this.$message.error("请选择至少一项");
                    return false;
                }

                this.$confirm("确定要把选中的试题恢复吗?","友情提示",{type:'warning'}).then(()=>{
                    removeOk({idsArray:this.checkbox,chapterId:this.chapter.id,type:this.tabValue}).then(res=>{
                        this.$message({
                            type: res.data.success ? 'success' : 'error',
                            message: res.data.message,
                            center:true
                        });
                        this.value = false;
                        this.$parent.getChapterList(this.$parent.curriculumData);
                    })
                });



            }
        },
        watch:{
            data(data){
                if(data){
                    if(data.singleList && data.singleList.length > 0){
                        this.tabValue = '1';
                    }else if(data.selectionList && data.selectionList.length > 0){
                        this.tabValue = "2";
                    }else if(data.askList && data.askList.length > 0){
                        this.tabValue = "3";
                    }else if(data.upperList && data.upperList.length > 0){
                        this.tabValue = "4";
                    }else{
                        this.tabValue = "0";
                    }
                }
            }
        }

    }
</script>

<style scoped>

</style>