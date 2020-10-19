<template>
    <div>
        <div style="margin: 20px 5px 10px 5px;padding: 5px;">
            <el-select v-model="params.discipline"  filterable style="margin-right:10px" placeholder="请选择试题所属学科">
                <el-option label="软件" value="1"></el-option>
                <el-option label="网络" value="2"></el-option>
                <el-option label="通用" value="3"></el-option>
            </el-select>
            <el-select v-model="params.chapterId"  filterable style="margin-right:10px" placeholder="请选择试题所在章节">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in chapterData"></el-option>
            </el-select>

            <el-select v-model="params.sourced"  filterable style="margin-right:10px" placeholder="请选择试题来源">
                <el-option label="课程试题" value="1"></el-option>
                <el-option label="面试宝典" value="2"></el-option>
                <el-option label="企业真题" value="3"></el-option>
            </el-select>

            <el-select v-model="params.companyId"  filterable style="margin-right:10px" placeholder="请选择企业">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in companyData"></el-option>
            </el-select>

            <el-select v-model="params.status"  filterable style="margin-right:10px" placeholder="请选择试题启禁状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
            </el-select>

        
            
            <el-input type="text" placeholder="请输入问答题题干关键字" v-model="params.askContent" style="width:217px;margin-right:10px"></el-input>


            <el-button plain type="success" @click="getList(params)"> <span class="el-icon-search"></span>查询</el-button>
            <el-button plain type="info" @click="params = {page:1,size:10,total:0,type:'3'},getList(params)"> <span class="el-icon-refresh-left"></span>清空</el-button>
			
		</div>
        <div style="margin: 5px;padding: 5px;">
            <el-table :data="askData" :loading="loading" element-loading-text="玩了命的加载...." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column type="index" align="center" width="80px">
                    <template slot="header">
                        <el-button size="mini" plain type="success" @click="openWindow('askChild',null)"><span class="el-icon-plus"></span></el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="discipline" label="学科" align="center"></el-table-column>
                <el-table-column prop="chapterName" label="所属章节" align="center"></el-table-column>
                <el-table-column prop="sourced" label="来源" align="center"></el-table-column>
                <el-table-column prop="companyName" label="企业名称" align="center">
                    <template slot-scope="scope">
                        {{scope.row.companyName ? scope.row.companyName : "/"}}
                    </template>
                </el-table-column>
                <el-table-column prop="askContent" label="题干" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" plain size="mini" @click="openWindow('askChild',scope.row)"><span class="el-icon-edit"></span>修改</el-button>
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

        <ask-child ref="askChild"></ask-child>

    </div>
</template>
<script>

    import { getList } from '@/api/academic/question.js'

    import { findChapters } from '@/api/academic/chapter.js'

    import { getCompanies } from '@/api/work/company.js'


    export default {
        name:'selection-index',
        components:{
            AskChild:()=>import("@/views/academic/question/ask-child.vue")
        },
        data(){
            return{
                loading:true,
                askData:[],
                chapterData:[],
                companyData:[],
                params:{page:1,size:10,total:0,type:'3'}
            }
        },
        methods:{
            openWindow(name,data){
                if(data == null){
                    this.$refs[name].ask = {};
                }else{
                    this.$refs[name].ask = data;
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
                getList(data).then(res=>{
                    if(res.data.success){
                        this.askData = res.data.data.rows;
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