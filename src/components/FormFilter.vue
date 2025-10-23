<script setup>
import { ref, computed, watch, isRef, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    names: { type: Array, default: () => [] },
    lvl: { type: Array, default: () => [] },
    tutors: { type: Array, default: () => [] },
    // akceptujemy: [], [{ name,lvl,tutor }], [{ value:[...] }], mieszanki, a nawet elementy bedace refami
    events: { type: Array, default: () => [] },
})

// --------- NORMALIZACJA DANYCH Z PARENT (bez zmian w parent) ---------
function flatRows(input) {
    const out = []
    const visit = (x) => {
        const v = isRef(x) ? x.value : x
        if (!v) return
        if (Array.isArray(v)) { v.forEach(visit); return }
        if (typeof v === 'object') {
            if (Array.isArray(v.value)) { v.value.forEach(visit); return }
            if (Array.isArray(v.items)) { v.items.forEach(visit); return }
            if (Array.isArray(v.rows)) { v.rows.forEach(visit); return }
            if ('name' in v && 'lvl' in v && 'tutor' in v) {
                out.push({ name: String(v.name), lvl: String(v.lvl), tutor: String(v.tutor) })
            }
        }
    }
    visit(input)
    return out
}

// --------- DETEKTOR MUTACJI W MIEJSCU (gdy parent robi .push) ---------
function signature(input) {
    const acc = []
    const visit = (x) => {
        const v = isRef(x) ? x.value : x
        if (!v) { acc.push('nil'); return }
        if (Array.isArray(v)) { acc.push('[' + v.length + ']'); v.forEach(visit); return }
        if (typeof v === 'object') {
            if (Array.isArray(v.value)) { acc.push('<value:' + v.value.length + '>'); v.value.forEach(visit); return }
            if ('name' in v && 'lvl' in v && 'tutor' in v) { acc.push(`${v.name}|${v.lvl}|${v.tutor}`); return }
            acc.push('{obj}'); return
        }
        acc.push(String(v))
    }
    visit(input)
    return acc.join('~')
}

const tick = ref(0)
let timer = null
let lastSig = ''

onMounted(() => {
    lastSig = signature(props.events)
    timer = setInterval(() => {
        const sig = signature(props.events)
        if (sig !== lastSig) {
            lastSig = sig
            tick.value++ // wymusza przeliczenie computed
        }
    }, 200)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

// rows zalezy od tick, wiec przeliczy sie gdy zmieni sie zawartosc props.events (nawet po .push)
const rows = computed(() => { void tick.value; return flatRows(props.events) })

// --------- SELECTY ZALEZNE ---------
const namesWL = computed(() => (Array.isArray(props.names) ? props.names : []))
const lvlWL = computed(() => (Array.isArray(props.lvl) ? props.lvl : []))
const tutorsWL = computed(() => (Array.isArray(props.tutors) ? props.tutors : []))

const selName = ref(null)
const selLvl = ref(null)
const selTutor = ref(null)

const uniq = (arr) => Array.from(new Set(arr))
const intersect = (arr, allow) => (allow && allow.length ? arr.filter(x => allow.includes(x)) : arr)

function rowsFilteredExcept(exceptKey) {
    return rows.value.filter(r =>
        (exceptKey === 'name' || !selName.value || r.name === selName.value) &&
        (exceptKey === 'lvl' || !selLvl.value || r.lvl === selLvl.value) &&
        (exceptKey === 'tutor' || !selTutor.value || r.tutor === selTutor.value)
    )
}

const availableNames = computed(() => intersect(uniq(rowsFilteredExcept('name').map(r => r.name)), namesWL.value))
const availableLvls = computed(() => intersect(uniq(rowsFilteredExcept('lvl').map(r => r.lvl)), lvlWL.value))
const availableTutors = computed(() => intersect(uniq(rowsFilteredExcept('tutor').map(r => r.tutor)), tutorsWL.value))

const filteredRows = computed(() =>
    rows.value.filter(r =>
        (!selName.value || r.name === selName.value) &&
        (!selLvl.value || r.lvl === selLvl.value) &&
        (!selTutor.value || r.tutor === selTutor.value)
    )
)

// spojnosc wyborow
watch(availableNames, (opts) => { if (selName.value && !opts.includes(selName.value)) selName.value = null })
watch(availableLvls, (opts) => { if (selLvl.value && !opts.includes(selLvl.value)) selLvl.value = null })
watch(availableTutors, (opts) => { if (selTutor.value && !opts.includes(selTutor.value)) selTutor.value = null })
</script>

<template>
    <!-- bez <v-app> tutaj -->
    <div class="d-flex flex-column ga-4" style="max-width: 520px">
        <v-select v-model="selName" :items="availableNames" label="Zajecia" clearable hide-details min-width="320"
            placeholder="Wybierz..." persistent-placeholder />
        <v-select v-model="selLvl" :items="availableLvls" label="Poziom" clearable hide-details min-width="320"
            placeholder="Wybierz..." persistent-placeholder />
        <v-select v-model="selTutor" :items="availableTutors" label="Trener" clearable hide-details min-width="320"
            placeholder="Wybierz..." persistent-placeholder />

        <v-card v-if="filteredRows.length">
            <v-card-text>
                <div class="text-subtitle-2 mb-2">Dopasowania:</div>
                <div v-for="(r, i) in filteredRows" :key="i">
                    {{ r.name }} — {{ r.lvl }} — {{ r.tutor }}
                </div>
            </v-card-text>
        </v-card>
        <v-alert v-else type="info" variant="tonal">Brak dopasowan.</v-alert>
    </div>
</template>
