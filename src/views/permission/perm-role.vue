<template>
    <div>
		
		<div style="margin: 20px 5px 10px 5px;padding: 5px;">
			<el-button plain size="mini" type="success" @click="openWindow('roleChild',null)"> <span class="el-icon-plus"></span> 新增角色</el-button>
		</div>
		
		<div :style="styleValue">
			<Scroll height="200">
				<el-tag :key="item" v-for="item in showArray" style="margin: 10px;">{{item}}</el-tag>
			</Scroll>
		</div>
		
		<div style="margin: 5px;padding: 5px;">
			<el-table :data="data" @row-dblclick="dbClick">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column prop="name" label="角色名称" align="center"></el-table-column>
				<el-table-column prop="description" label="角色描述" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button plain type="success" size="mini" @click="openWindow('roleChild',scope.row)">
							<span class="el-icon-edit"></span>修改
						</el-button>
						<el-button plain type="success" size="mini" @click="remove(scope.row)">
							<span class="el-icon-delete"></span>删除
						</el-button>
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
		<role-child ref="roleChild"></role-child>
    </div>
</template>

<script>
	
	import { list } from '@/api/access/role.js'
 	
    export default {
        name: "perm-role",
		data(){
			return {
				data:[],
				params:{page:1,size:5,total:0},
				styleValue:{
					marginTop:'20px',
					height:'200px',
					display:'none'
				},
				showArray:[]
			}
		},
		components:{
			RoleChild:()=>import("@/views/permission/child/role-child.vue")
		},
		methods:{
			handleSizeChange(val){
				this.params.size = val;
				this.getList(this.params);
			},
			handlePageChange(val){
				this.params.page = val;
				this.getList(this.params);
			},
			getList(data){
				list(data).then(res=>{
					if(res.data.success){
						this.data = res.data.data.rows;
						this.params.total = res.data.data.total;
					}
				});
			},
			openWindow(name,data){
				if(data == null){
					this.$refs[name].data = {};
				}else{
					this.$refs[name].data = data;
				}
				this.$refs[name].value = true;
			},
			remove(data){
				this.$message.info("sorry,目前不提供删除功能");
				return false;
			},
			dbClick(row,column,event){
				let arr = [];
				row.permissions.forEach(permission=>{
					arr.push(permission.name);
				});
				
				this.showArray = arr;
				this.styleValue.display = 'block';
			}
		},
		created(){
			this.styleValue.display = 'none';
			this.getList(this.params);
		}
    }
</script>

<style scoped>

</style>