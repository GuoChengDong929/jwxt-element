<template>
    <div>
        <div style="margin: 20px 5px 10px 5px;padding: 5px;">
            <el-select size="mini" v-model="params.discipline"  filterable style="margin-right:10px" placeholder="请选择试题所属学科">
                <el-option label="软件" value="1"></el-option>
                <el-option label="网络" value="2"></el-option>
                <el-option label="通用" value="3"></el-option>
            </el-select>
            <el-select size="mini" v-model="params.chapterId"  filterable style="margin-right:10px" placeholder="请选择试题所在章节">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in chapterData"></el-option>
            </el-select>

            <el-select size="mini" v-model="params.sourced"  filterable style="margin-right:10px" placeholder="请选择试题来源">
                <el-option label="课程试题" value="1"></el-option>
                <el-option label="面试宝典" value="2"></el-option>
                <el-option label="企业真题" value="3"></el-option>
            </el-select>

            <el-select size="mini" v-model="params.companyId"  filterable style="margin-right:10px" placeholder="请选择企业">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in companyData"></el-option>
            </el-select>

            <el-select size="mini" v-model="params.status"  filterable style="margin-right:10px" placeholder="请选择试题启禁状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
            </el-select>

        
            
            <el-input size="mini" type="text" placeholder="请输入单选题题干关键字" v-model="params.singleContent" style="width:217px;margin-right:10px"></el-input>


            <el-button size="mini" plain type="success" @click="getList(params)"> <span class="el-icon-search"></span>查询</el-button>
            <el-button size="mini" plain type="info" @click="params = {page:1,size:10,total:0,type:'1'},getList(params)" style="margin-right:10px"> <span class="el-icon-refresh-left"></span>清空</el-button>
			<!--<el-popover placement="bottom" width="240" @after-leave="hide">
                <p style="margin: 5px 0px 0px 0px">是否要加入大标题</p>
                <el-radio-group v-model="showOrHiddenHeader" style="margin: 5px 0px 0px 0px">
                    <el-radio label="1">否</el-radio>
                    <el-radio label="2">是</el-radio>
                </el-radio-group>

                <el-input size="mini" v-model="headerContent" placeholder="请选择,并输入标题名称" style="margin: 5px 0px 0px 0px"></el-input>

                <p style="margin: 5px 0px 0px 0px">请选择要导出的字段?</p>
                <el-checkboxGroup v-model="popoverList">
                    <el-checkbox label="discipline">学科</el-checkbox><br/>
                    <el-checkbox label="chapterName">章节名称</el-checkbox><br/>
                    <el-checkbox label="sourced">来源</el-checkbox><br/>
                    <el-checkbox label="companyName">企业名称</el-checkbox><br/>
                    <el-checkbox label="singleContent">单选题题干</el-checkbox><br/>
                    <el-checkbox label="singleOptionA">选项A</el-checkbox><br/>
                    <el-checkbox label="singleOptionB">选项B</el-checkbox><br/>
                    <el-checkbox label="singleOptionC">选项C</el-checkbox><br/>
                    <el-checkbox label="singleOptionD">选项D</el-checkbox><br/>
                    <el-checkbox label="singleAsk">答案</el-checkbox><br/>
                    <el-checkbox label="status">状态</el-checkbox><br/>
                </el-checkboxGroup >
                <el-button size="mini" plain type="danger"  @click="exportData" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
                <el-button size="mini" slot="reference" plain type="warning" style="margin-right:10px"><i class="el-icon-download"></i> 导出</el-button>
            </el-popover>
            -->

           <!-- <el-popover placement="bottom" width="400" @after-leave="uploadHide">
                <el-upload
                        ref="upload"
                        name="file"
                        :limit="1"
                        :auto-upload="false"
                        class="upload-demo"
                        list-type="text"
                        :file-list="fileList"
                        :headers="{'Authorization': token()}"
                        drag
                        action="http://localhost:56700/question/uploadQuestion"
                        :on-success="uploadSuccess"
                        :on-exceed="uploadExceed"
                        :on-change="uploadChange"
                        :on-error="uploadError"

                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text"><em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传xlsx结尾的文件</div>
                </el-upload>
                <el-button size="mini" plain type="danger"  @click="importData" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
                <el-button size="mini" slot="reference" plain type="danger" style="margin-right:10px"><i class="el-icon-upload"></i> 导入</el-button>
            </el-popover>-->


		</div>
        <div style="margin: 5px;padding: 5px;">
            <el-table :data="singleData" :loading="loading" element-loading-text="玩了命的加载...." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column type="index" align="center" width="80px">
                    <template slot="header">
                        <el-button size="mini" plain type="success" @click="openWindow('singleChild',null)"><span class="el-icon-plus"></span></el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="discipline" label="学科" align="center"></el-table-column>
                <el-table-column prop="chapterName" label="所属章节" align="center"></el-table-column>
                <el-table-column prop="sourced" label="来源" align="center"></el-table-column>
                <el-table-column prop="companyName" label="企业名称" align="center">
                    <template slot-scope="scope">
                        {{scope.row.companyName == "null" ? '/' : scope.row.companyName}}
                    </template>
                </el-table-column>
                <el-table-column prop="singleContent" label="题干" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" plain @click="openWindow('singleChild',scope.row)"><i class="el-icon-edit"></i>修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin: 10px;text-align: center;">
			<el-pagination background
			 layout="prev,pager,next" 
			 :total="params.total" 
			 :page-size="params.size" 
			 :current-page="params.page" 
			 :hide-on-single-page="true"
			 @size-change="handleSizeChange"
			 @current-change="handlePageChange"></el-pagination>
		</div>
        <single-child ref="singleChild"></single-child>
    </div>
</template>
<script>

    import { getList,exportData } from '@/api/academic/question.js'

    import { findChapters } from '@/api/academic/chapter.js'

    import { getCompanies } from '@/api/work/company.js'

    import { getToken } from '@/utils/tools';

    export default {
        name:'single-index',
        components:{
            SingleChild:()=>import("@/views/academic/question/single-child.vue")
        },
        data(){
            return {
                loading:false, //表格loading
                fullscreenLoading:false, //导出loading
                singleData:[],
                chapterData:[],
                companyData:[],
                params:{page:1,size:10,total:0,type:'1'},
                popoverList:[],
                showOrHiddenHeader:'1',
                headerContent:null,
                fileList:[]
            }
        },
        methods:{
            token(){
                return getToken();
            },
            exportData(){
                if(this.popoverList.length < 2){
                    this.$message.warning("字段至少2个");
                    return false;
                }

                if(this.showOrHiddenHeader == '2' && !this.headerContent){
                    this.$message.warning("请输入标题名称");
                    return false;
                }

               this.$confirm("确定要导出数据吗?","友情提示",{type:'warning'}).then(()=>{
                   this.fullscreenLoading = true;
                   let testData={
                       type:'1',
                       excelOptions:this.popoverList,
                       showOrHiddenHeader:this.showOrHiddenHeader,
                       headerContent: this.headerContent
                   };

                   exportData(testData).then(res=>{

                       const blob = new Blob([res.data]);
                       const fileName = '教务系统-单选题.xlsx';
                       const elink = document.createElement('a');
                       elink.download = fileName;
                       elink.style.display = 'none';
                       elink.href = URL.createObjectURL(blob);
                       document.body.appendChild(elink);
                       elink.click();
                       URL.revokeObjectURL(elink.href); // 释放URL 对象
                       document.body.removeChild(elink);


                       this.$message.success("导出成功");
                       this.fullscreenLoading = false;
                   }).catch(e=>{
                       this.$message.error("导出失败");
                       return false;
                   });

               });
            },
            uploadSuccess(response,file,filelist){ //response中有该上机题的id 通过id进行表单数据的修改

            },
            uploadError(err,file,fileList){
                this.$message.error(file.name + "文件上传失败");
                return false;
            },
            uploadExceed(){
                this.$message.error("上传的文件超出了限定了个数");
                return false;
            },
            uploadChange(file,fileList){

                // if( !(file.raw.type === 'application/x-zip-compressed')){
                //     this.$refs.upload.uploadFiles = [];
                //     this.$message.error("只能上传ZIP文件");
                //     return false;
                // }
                if(file.size / 1024 / 1024 > 50){
                    this.$refs.upload.uploadFiles = [];
                    this.$message.error("上传的文件不能超过50MB");
                    return false;
                }

            },
            importData(){
                if(this.$refs.upload.uploadFiles.length != 1){
                    this.$message.error("请选择文件");
                    return false;
                }

                this.$confirm("文件一旦提交,无法修改,你确定提交吗?","友情提示",{type:'warning'}).then(()=>{
                    this.fullscreenLoading = true;
                    this.$refs.upload.submit();
                    setTimeout(()=>{
                        this.$message.success("导入成功");
                        this.fullscreenLoading = false;
                        this.getList(this.params);
                    },2000)
                });
            },
            hide(){ //popover 隐藏时触发, 清空复选框选项
              this.popoverList = [];
              this.headerContent = null;
              this.showOrHiddenHeader = '1';
            },
            uploadHide(){
              this.fileList = [];
            },
            openWindow(name,data){
                if(data == null){
                    this.$refs[name].single = {};
                }else{
                    this.$refs[name].single = data;
                }
                this.$refs[name].value = true;
            },
            handleSizeChange(val){
                this.params.size = val;
                this.getList(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.getList(this.params);
            },
            getList(data){
                this.loading = true;
                getList(data).then(res=>{
                    if(res.data.success){
                        this.singleData = res.data.data.rows;
                        this.params.total = res.data.data.total;
                        this.loading = false;
                    }
                });
            }
        },
        created(){

            this.getList(this.params);

            findChapters().then(res=>{
                if(res.data.success){
                    this.chapterData = res.data.data;
                }
            });


            getCompanies().then(res=>{
                if(res.data.success){
                    this.companyData = res.data.data;
                }
            });


           
        }
    }
</script>
<style scoped>

</style>