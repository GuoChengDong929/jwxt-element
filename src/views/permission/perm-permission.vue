<template>
    <div style="height: 85vh">
		<div style="height:7vh;margin: 20px 5px 10px 5px;padding: 5px">
			<el-button  plain  type="success" @click="openWindow('permissionChild',null)"> <span class="el-icon-plus"></span> 新增菜单</el-button>
			<el-button type="warning" style="float: right">温馨提示:  权限数据一旦添加,则无法修改和删除,请谨慎操作</el-button>
		</div>
		
		<div style="margin: 5px;padding: 5px;height: 78vh">
			<el-table :data="data" row-key="id" :tree-props="{children: 'children'}">
				<el-table-column type="index"></el-table-column>
				<el-table-column label="权限名称" prop="name" >
					<template slot-scope="scope">
						<span :style="{'color': (scope.row.type == 1 && scope.row.pid == 0) ? '#67C23A' :(scope.row.type == 1 && scope.row.pid != 0) ? '#E6A23C' : ( scope.row.type == 2 ? '#F56C6C' : '#909399' ) }">{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="权限编码" prop="code" align="center">
					<template slot-scope="scope">
						<span :style="{'color': (scope.row.type == 1 && scope.row.pid == 0) ? '#67C23A' :(scope.row.type == 1 && scope.row.pid != 0) ? '#E6A23C' : ( scope.row.type == 2 ? '#F56C6C' : '#909399' ) }">{{scope.row.code}}</span>
					</template>
				</el-table-column>
				<el-table-column label="权限类型" prop="type" align="center">
					<template slot-scope="scope">
						<span :style="{'color': (scope.row.type == 1 && scope.row.pid == 0) ? '#67C23A' :(scope.row.type == 1 && scope.row.pid != 0) ? '#E6A23C' : ( scope.row.type == 2 ? '#F56C6C' : '#909399' ) }">
						{{(scope.row.type == '1' && scope.row.pid == 0 ) ? '顶级菜单' : ((scope.row.type == '1' && scope.row.pid != 0) ? "子级菜单" : ( scope.row.type == '2' ? "按钮" : "API"))}}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="是否可见" prop="enVisible" align="center" >
					<template slot-scope="scope">
						<span :style="{'color': (scope.row.type == 1 && scope.row.pid == 0) ? '#67C23A' :(scope.row.type == 1 && scope.row.pid != 0) ? '#E6A23C' : ( scope.row.type == 2 ? '#F56C6C' : '#909399' ) }">{{scope.row.enVisible == 1 ? '可见':'不可见'}}</span>
					</template>
				</el-table-column>
				
				<!--<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button plain @click="openWindow('permissionChild',scope.row)" :type="(scope.row.type == 1 && scope.row.pid == 0) ? 'success' :(scope.row.type == 1 && scope.row.pid != 0) ? 'warning' : ( scope.row.type == 2 ? 'danger' : 'info' ) " size="mini">
							<span class="el-icon-edit"></span>修改
						</el-button>
						
						<el-button plain @click="remove(scope.row)" :type="(scope.row.type == 1 && scope.row.pid == 0) ? 'success' :(scope.row.type == 1 && scope.row.pid != 0) ? 'warning' : ( scope.row.type == 2 ? 'danger' : 'info' ) " size="mini">
							<span class="el-icon-delete"></span>删除
						</el-button>
					</template>
				</el-table-column>-->
			</el-table>
		</div>
		<permission-child ref="permissionChild"></permission-child>
    </div>
</template>

<script>
	
	import * as permissionApi  from '../../api/access/permission.js'
	
    export default {
        name: "perm-permission",
		data(){
			return {
				params:{},
				data:[]
			}
		},
		components:{
			PermissionChild:()=> import ("@/views/permission/child/permission-child.vue")
		},
		methods:{
			openWindow(name,data){
				if(data == null) {
					this.$refs[name].data = {};
				} else {
					this.$refs[name].tree = {expandedKeys:[],currentNodeKey:''};
					this.$refs[name].data = data;
				}
				this.$refs[name].value = true;
			},
			remove(data){
				//向下查看是否有子类 ,如果有则不可删除
				if(data.children && data.children.length > 0){
					this.$message.error("有子类无法删除");
					return false;
				}
				
				this.$confirm("确定要删除吗?","友情提示",{type:'warning'}).then(()=>{
					permissionApi.remove({id:data.id}).then(res=>{
						this.$message({
							type:res.data.success?'success':'error',
							message:res.data.message
						});
						this.findAll();
					});
				});
				
			},
			findAll(){
				permissionApi.all().then(res=>{
					this.data = res.data.data;
				});
			}
		},
		created(){
			this.findAll();
		}
    }
</script>

<style scoped>

</style>