<script setup>
import { ref,computed } from 'vue'

// 1.接收从Astro传递过来的所有文章数据
const props = defineProps({
    posts:{
        type:Array,
        required:true
    }
})

// 2.用户搜索的关键词
const searchQuery = ref('')

// 3.计算属性:根据关键词实时过滤文章
const filteredPosts = computed(()=>{
    if(!searchQuery.value.trim()){
        return [] 
    }
    const query = searchQuery.value.toLowerCase()
    return props.posts.filter(post=>{
        // 根据文章的标题和描述进行匹配
        if (post.data.title.toLowerCase().includes(query)) return true
        if (post.data.description && post.data.description.toLowerCase().includes(query)) return true
        if (post.data.tags && post.data.tags.some(tag=>tag.toLowerCase().includes(query))) return true
        return false
    })
})

</script>
<template>
    <div class="search-container">
        <input 
        type="text"
        v-model="searchQuery"
        placeholder="搜索文章..."
        class="search-input" 
        />
        <div v-if="searchQuery" class="search-results">
            <div v-if="filteredPosts.length === 0" class="no-results">
                没有找到相关文章
            </div>
            <a
            v-for="post in filteredPosts"
            :key="post.slug"
            :href="`/posts/${post.slug}`"
            class="result-item"
            >
                <h3>{{ post.data.title }}</h3>
                <p v-if="post.data.description">{{ post.data.description }}</p>

            </a>
        </div>
    </div>

</template>

<style scoped>
    input{
        margin-top: 1.5rem;
        border: none;
        width: 80vw;
        height: 3rem;
        border-radius: 2rem;
        padding: 1rem;
        background-color: rgb(230, 232, 201);
        box-shadow: 0 1rem 1rem rgba(108, 110, 86, 0.7);
        font-size: 1.2rem;
    }
    input:focus {
        outline: none;
    }
</style>
