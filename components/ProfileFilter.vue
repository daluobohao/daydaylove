<style scoped>
.filter-panel {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
    padding: 20px;
    max-height: 80vh;
    overflow-y: auto;
}
.filter-section {
    margin-bottom: 16px;
}
.filter-section-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
}
.filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.filter-tag {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    background: #fff;
    color: #666;
    transition: all 0.2s;
}
.filter-tag:hover {
    border-color: #EB455F;
    color: #EB455F;
}
.filter-tag-active {
    background: rgba(235, 69, 95, 0.1);
    border-color: #EB455F;
    color: #EB455F;
}
.range-row {
    display: flex;
    align-items: center;
    gap: 8px;
}
.range-input {
    width: 70px;
}
.range-separator {
    color: #999;
    font-size: 13px;
}
.filter-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
}
.reverse-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #666;
    cursor: pointer;
}
.reverse-toggle-active {
    color: #EB455F;
}
</style>

<template>
    <div class="filter-panel">
        <div class="filter-section">
            <div class="filter-section-title">性别</div>
            <div class="filter-tags">
                <span
                    v-for="opt in SEX_OPTIONS"
                    :key="opt"
                    class="filter-tag"
                    :class="{ 'filter-tag-active': filters.sex === opt }"
                    @click="toggleSex(opt)"
                >{{ opt }}</span>
                <span
                    class="filter-tag"
                    :class="{ 'filter-tag-active': filters.sex === '' }"
                    @click="toggleSex('')"
                >不限</span>
            </div>
        </div>

        <div class="filter-section">
            <div class="filter-section-title">年龄范围</div>
            <div class="range-row">
                <el-input-number
                    v-model="filters.ageMin"
                    :min="18"
                    :max="45"
                    :step="1"
                    size="small"
                    class="range-input"
                    controls-position="right"
                />
                <span class="range-separator">—</span>
                <el-input-number
                    v-model="filters.ageMax"
                    :min="18"
                    :max="45"
                    :step="1"
                    size="small"
                    class="range-input"
                    controls-position="right"
                />
                <span class="range-separator">岁</span>
            </div>
        </div>

        <div class="filter-section">
            <div class="filter-section-title">身高范围</div>
            <div class="range-row">
                <el-input-number
                    v-model="filters.heightMin"
                    :min="150"
                    :max="190"
                    :step="1"
                    size="small"
                    class="range-input"
                    controls-position="right"
                />
                <span class="range-separator">—</span>
                <el-input-number
                    v-model="filters.heightMax"
                    :min="150"
                    :max="190"
                    :step="1"
                    size="small"
                    class="range-input"
                    controls-position="right"
                />
                <span class="range-separator">cm</span>
            </div>
        </div>

        <div class="filter-section">
            <div class="filter-section-title">学历</div>
            <div class="filter-tags">
                <span
                    v-for="opt in EDUCATION_OPTIONS"
                    :key="opt"
                    class="filter-tag"
                    :class="{ 'filter-tag-active': filters.education === opt }"
                    @click="toggleEducation(opt)"
                >{{ opt }}</span>
                <span
                    class="filter-tag"
                    :class="{ 'filter-tag-active': filters.education === '' }"
                    @click="toggleEducation('')"
                >不限</span>
            </div>
        </div>

        <div class="filter-section">
            <div class="filter-section-title">城市</div>
            <el-select
                v-model="filters.city"
                placeholder="选择城市"
                clearable
                filterable
                size="small"
                style="width: 100%"
            >
                <el-option
                    v-for="c in MAJOR_CITIES"
                    :key="c"
                    :label="c"
                    :value="c"
                />
            </el-select>
        </div>

        <div class="filter-section">
            <div class="filter-section-title">婚姻状况</div>
            <div class="filter-tags">
                <span
                    v-for="opt in MARITAL_STATUS_OPTIONS"
                    :key="opt"
                    class="filter-tag"
                    :class="{ 'filter-tag-active': filters.maritalStatus === opt }"
                    @click="toggleMaritalStatus(opt)"
                >{{ opt }}</span>
                <span
                    class="filter-tag"
                    :class="{ 'filter-tag-active': filters.maritalStatus === '' }"
                    @click="toggleMaritalStatus('')"
                >不限</span>
            </div>
        </div>

        <div class="filter-actions">
            <div class="reverse-toggle" :class="{ 'reverse-toggle-active': reverseMatch }" @click="reverseMatch = !reverseMatch">
                <svg v-if="reverseMatch" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M426.666667 682.666667H170.666667v-85.333334h256v-85.333333l128 128-128 128v-85.333333z m170.666666-341.333334h256v85.333334h-256v85.333333l-128-128 128-128v85.333333z" fill="#EB455F"/></svg>
                <svg v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M426.666667 682.666667H170.666667v-85.333334h256v-85.333333l128 128-128 128v-85.333333z m170.666666-341.333334h256v85.333334h-256v85.333333l-128-128 128-128v85.333333z" fill="#999"/></svg>
                按择偶要求反向筛选
            </div>
            <div>
                <el-button size="small" @click="resetFilters">重置</el-button>
                <el-button size="small" type="primary" @click="applyFilters">筛选</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElInputNumber, ElSelect, ElOption, ElButton } from 'element-plus'
import { SEX_OPTIONS, EDUCATION_OPTIONS, MARITAL_STATUS_OPTIONS, MAJOR_CITIES } from '~/shared/profilesSeed'
import type { ProfileSeedItem } from '~/shared/profilesSeed'

export type FilterState = {
    sex: string
    ageMin: number
    ageMax: number
    heightMin: number
    heightMax: number
    education: string
    city: string
    maritalStatus: string
}

const emit = defineEmits<{
    (e: 'filter', filtered: ProfileSeedItem[]): void
    (e: 'close'): void
}>()

const props = defineProps<{
    profiles: ProfileSeedItem[]
}>()

const filters = reactive<FilterState>({
    sex: '',
    ageMin: 18,
    ageMax: 45,
    heightMin: 150,
    heightMax: 190,
    education: '',
    city: '',
    maritalStatus: '',
})

const reverseMatch = ref(false)

const toggleSex = (val: string) => { filters.sex = filters.sex === val ? '' : val }
const toggleEducation = (val: string) => { filters.education = filters.education === val ? '' : val }
const toggleMaritalStatus = (val: string) => { filters.maritalStatus = filters.maritalStatus === val ? '' : val }

function birthToAge(birth: string): number {
    if (!birth) return 0
    const yearMatch = birth.match(/(\d{4})/)
    if (!yearMatch) return 0
    const birthYear = parseInt(yearMatch[1], 10)
    return new Date().getFullYear() - birthYear
}

function educationRank(edu: string): number {
    const idx = (EDUCATION_OPTIONS as readonly string[]).indexOf(edu)
    return idx >= 0 ? idx : -1
}

function applyFilters() {
    let result = [...props.profiles]

    if (reverseMatch.value) {
        result = result.filter((item) => {
            const pe = item.partnerExpect
            if (!pe || Object.keys(pe).length === 0) return true
            if (pe.ageMin && birthToAge(item.birth) < pe.ageMin) return false
            if (pe.ageMax && birthToAge(item.birth) > pe.ageMax) return false
            if (pe.heightMin && parseInt(item.height) < pe.heightMin) return false
            if (pe.heightMax && parseInt(item.height) > pe.heightMax) return false
            if (pe.education && educationRank(item.education) < educationRank(pe.education)) return false
            if (pe.city && item.city !== pe.city) return false
            if (pe.maritalStatus && item.maritalStatus !== pe.maritalStatus) return false
            return true
        })
    } else {
        if (filters.sex) {
            result = result.filter((item) => item.sex === filters.sex)
        }
        if (filters.ageMin > 18 || filters.ageMax < 45) {
            result = result.filter((item) => {
                const age = birthToAge(item.birth)
                return age >= filters.ageMin && age <= filters.ageMax
            })
        }
        if (filters.heightMin > 150 || filters.heightMax < 190) {
            result = result.filter((item) => {
                const h = parseInt(item.height, 10)
                if (!h) return true
                return h >= filters.heightMin && h <= filters.heightMax
            })
        }
        if (filters.education) {
            result = result.filter((item) => educationRank(item.education) >= educationRank(filters.education))
        }
        if (filters.city) {
            result = result.filter((item) => item.city === filters.city)
        }
        if (filters.maritalStatus) {
            result = result.filter((item) => item.maritalStatus === filters.maritalStatus)
        }
    }

    emit('filter', result)
    emit('close')
}

function resetFilters() {
    filters.sex = ''
    filters.ageMin = 18
    filters.ageMax = 45
    filters.heightMin = 150
    filters.heightMax = 190
    filters.education = ''
    filters.city = ''
    filters.maritalStatus = ''
    reverseMatch.value = false
    emit('filter', [...props.profiles])
    emit('close')
}
</script>
