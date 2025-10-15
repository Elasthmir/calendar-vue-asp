<script setup>
    import { onMounted, ref } from 'vue'

    const calendar = ref()

    const typeToLabel = {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
    }
    const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
    const names = ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']

    const focus = ref('')
    const type = ref('week')
    const selectedEvent = ref({})
    const selectedElement = ref(null)
    const selectedOpen = ref(false)
    const events = ref([])

    onMounted(() => {
        calendar.value.checkChange()
    })

    function viewDay(nativeEvent, { date }) {
        focus.value = date
        type.value = 'day'
    }
    function getEventColor(event) {
        return event.color
    }
    function setToday() {
        focus.value = ''
    }
    function prev() {
        calendar.value.prev()
    }
    function next() {
        calendar.value.next()
    }
    function showEvent(nativeEvent, { event }) {
        const open = () => {
            selectedEvent.value = event
            selectedElement.value = nativeEvent.target
            requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
        }
        if (selectedOpen.value) {
            selectedOpen.value = false
            requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
            open()
        }
        nativeEvent.stopPropagation()
    }
    function updateRange({ start, end }) {
        const _events = []
        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = rnd(days, days + 20)
        for (let i = 0; i < 27; i++) {
            const allDay = rnd(0, 3) === 0
            const firstTimestamp = rnd(min.getTime(), max.getTime())
            const first = new Date(firstTimestamp - (firstTimestamp % 900000))
            const secondTimestamp = 3600000                                         //1h jak wiecej to zwiekszyc
            console.log(days)
            const second = new Date(first.getTime() + secondTimestamp)
            _events.push({
                name: names[rnd(0, names.length - 1)],
                start: first,
                end: second,
                color: colors[rnd(0, colors.length - 1)],
                timed: !allDay,
            })
        }
        events.value = _events
    }
    function rnd(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
    }
</script>

<template>
  <div class="main">
    <div class="title">
      <h1>PLAN ZAJĘĆ</h1>
    </div>
    <div class="calendar">
        <v-row class="fill-height">
            <v-col>
                <v-sheet height="64">
                    <v-toolbar flat>
                        <v-btn class="me-4"
                               color="grey-darken-2"
                               variant="outlined"
                               @click="setToday">
                            Today
                        </v-btn>
                        <v-btn color="grey-darken-2"
                               size="small"
                               variant="text"
                               icon
                               @click="prev">
                            <v-icon size="small"> mdi-chevron-left </v-icon>
                        </v-btn>
                        <v-btn color="grey-darken-2"
                               size="small"
                               variant="text"
                               icon
                               @click="next">
                            <v-icon size="small"> mdi-chevron-right </v-icon>
                        </v-btn>
                        <v-toolbar-title v-if="calendar">
                            {{ calendar.title }}
                        </v-toolbar-title>
                        <v-menu location="bottom end">
                            <template v-slot:activator="{ props }">
                                <v-btn color="grey-darken-2" variant="outlined" v-bind="props">
                                    <span>{{ typeToLabel[type] }}</span>
                                    <v-icon end> mdi-menu-down </v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="type = 'day'">
                                    <v-list-item-title>Day</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="type = 'week'">
                                    <v-list-item-title>Week</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="type = 'month'">
                                    <v-list-item-title>Month</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="type = '4day'">
                                    <v-list-item-title>4 days</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-toolbar>
                </v-sheet>
                <v-sheet height="600">
                    <v-calendar ref="calendar"
                                v-model="focus"
                                :event-color="getEventColor"
                                :events="events"
                                :locale="{ id: 'en' }"
                                :interval-minutes="60"
                                :interval-height="120"
                                :type="type"
                                weekdays="1,2,3,4,5"
                                color="primary"
                                @change="updateRange"
                                @click:date="viewDay"
                                @click:event="showEvent"
                                @click:more="viewDay">
                        <template #event="{ event, timed, start, end }">
                            <div class="event-box">
                                <div class="titleTest">{{ event.name }}</div>
                                <div class="meta">
                                    <div v-if="timed">
                                        {{ event.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }}
                                        - {{ event.end.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }}
                                    </div>
                                    <div v-if="event.room"> • {{ event.room }}</div>
                                </div>
                                <div class="notes" v-if="event.notes">{{ event.notes }}</div>
                            </div>
                        </template>


                    </v-calendar>
                    <v-menu v-model="selectedOpen"
                            :activator="selectedElement"
                            :close-on-content-click="false"
                            location="end">
                        <v-card color="grey-lighten-4" min-width="350px" flat>
                            <v-toolbar :color="selectedEvent.color" dark>
                                <v-btn icon>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                                <v-btn icon>
                                    <v-icon>mdi-heart</v-icon>
                                </v-btn>
                                <v-btn icon>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card-text>
                                <span v-html="selectedEvent.details"></span>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="secondary"
                                       variant="text"
                                       @click="selectedOpen = false">
                                    Cancel
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-menu>
                </v-sheet>
            </v-col>
        </v-row>
        </div>
  </div>
</template>
<style scoped lang="scss">
    @import "../assets/classes.scss";



.calendar {
  width: 1780px;
}
.v-calendar-daily {
  background: transparent;
  color: white;
  font-size: 132px;
}
    :deep() {
        .v-calendar-daily_head-weekday {
            //-webkit-text-stroke: 2px rgb(255, 213, 0);
            font-size: 100px;
        }

        .v-calendar-daily_head-day.v-present {
            -webkit-text-stroke: 2px rgb(255, 213, 0);
            //color: transparent !important;
        }

        .bg-primary, .text-primary {
            color: transparent !important;
            background-color: transparent !important;
        }

        .v-calendar-daily .v-calendar-daily_head-day.v-past .v-calendar-daily_head-weekday, .v-calendar-daily .v-calendar-daily_head-day.v-past .v-calendar-daily_head-day-label {
            color: rgb(71 71 71) !important;
        
    }

        .v-icon-btn {
            //-webkit-text-stroke: 2px rgb(255, 213, 0);
            font-size: 100px;
        }

        .v-calendar-daily .v-calendar-daily__intervals-body .v-calendar-daily__interval-text {
            //webkit-text-stroke: 2px rgb(255, 213, 0);
            font-size: 30px;
            color: rgb(178, 162, 69);
        }

        .v-calendar-daily .v-calendar-daily_head-day {
            border-right: rgb(255 255 255 / 12%) 1px solid;
            border-bottom: rgb(255 255 255 / 12%) 1px solid;
        }

        .v-calendar-daily .v-calendar-daily__day-interval {
            border-top: rgb(249 249 249 / 12%) 1px solid;
            border-right: rgb(249 249 249 / 12%) 1px solid;
            padding: 20px;
        }

        .v-calendar-daily__interval-text {
            top: -19px;
        }
    }

</style>