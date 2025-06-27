<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-96">
      <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Class' : 'Add Class' }}</h2>
      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Title</label>
          <input v-model="form.title" type="text" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.title }">
          <span v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Category</label>
          <input v-model="form.category" type="text" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.category }">
          <span v-if="errors.category" class="text-red-500 text-sm">{{ errors.category }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Description</label>
          <textarea v-model="form.description" class="w-full p-2 border rounded"
                    :class="{ 'border-red-500': errors.description }"></textarea>
          <span v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Start Time</label>
          <input v-model="form.startTime" type="datetime-local" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.startTime }">
          <span v-if="errors.startTime" class="text-red-500 text-sm">{{ errors.startTime }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">End Time</label>
          <input v-model="form.endTime" type="datetime-local" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.endTime }">
          <span v-if="errors.endTime" class="text-red-500 text-sm">{{ errors.endTime }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Capacity</label>
          <input v-model.number="form.capacity" type="number" min="1" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.capacity }">
          <span v-if="errors.capacity" class="text-red-500 text-sm">{{ errors.capacity }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Workouts</label>
          <select v-model="form.workoutIds" multiple class="w-full p-2 border rounded h-24"
                  :class="{ 'border-red-500': errors.workoutIds }">
            <option v-for="workout in workouts" :key="workout.id" :value="workout.id">
              {{ workout.name }}
            </option>
          </select>
          <span v-if="errors.workoutIds" class="text-red-500 text-sm">{{ errors.workoutIds }}</span>
          <small class="text-gray-500">Hold Ctrl/Cmd to select multiple workouts</small>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Image URL</label>
          <input v-model="form.imageUrl" type="url" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.imageUrl }">
          <span v-if="errors.imageUrl" class="text-red-500 text-sm">{{ errors.imageUrl }}</span>
        </div>
        <div class="flex justify-end mt-4">
          <button type="button" @click="$emit('close')" class="mr-2 px-4 py-2">Cancel</button>
          <button type="submit" class="bg-primary text-white px-4 py-2 rounded">
            {{ isEditing ? 'Save Changes' : 'Add Class' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone';
import WorkoutService from '@/services/workouts.js';

export default {
  props: {
    classItem: Object,
    visible: Boolean
  },
  data() {
    return {
      form: {
        title: '',
        category: '',
        description: '',
        startTime: '',
        endTime: '',
        capacity: 1,
        imageUrl: '',
        workoutIds: []
      },
      errors: {},
      workouts: []
    };
  },
  computed: {
    isEditing() {
      return !!this.classItem;
    }
  },
  watch: {
    classItem: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            title: val.title || '',
            category: val.category || '',
            description: val.description || '',
            startTime: val.startTime ? moment(val.startTime).format('YYYY-MM-DDTHH:mm') : '',
            endTime: val.endTime ? moment(val.endTime).format('YYYY-MM-DDTHH:mm') : '',
            capacity: val.capacity || 1,
            imageUrl: (val.imageUrls && val.imageUrls[0]) || '',
            workoutIds: val.workoutIds || []
          };
        } else {
          this.form = {
            title: '',
            category: '',
            description: '',
            startTime: '',
            endTime: '',
            capacity: 1,
            imageUrl: '',
            workoutIds: []
          };
        }
      }
    }
  },
  methods: {
    async submit() {
      this.errors = {};
      if (!this.form.title.trim()) this.errors.title = 'Title is required';
      if (!this.form.category.trim()) this.errors.category = 'Category is required';
      if (!this.form.startTime) this.errors.startTime = 'Start time is required';
      if (!this.form.endTime) this.errors.endTime = 'End time is required';
      if (!this.form.capacity || this.form.capacity < 1) this.errors.capacity = 'Capacity must be at least 1';
      if (!this.form.workoutIds || this.form.workoutIds.length === 0) this.errors.workoutIds = 'At least one workout ID is required';
      if (this.form.imageUrl && !/^https?:\/\/.*\.(png|jpg|jpeg|gif)$/i.test(this.form.imageUrl))
        this.errors.imageUrl = 'Must be a valid image URL or empty';

      if (Object.keys(this.errors).length > 0) return;

      this.$emit('save', {
        ...this.form,
        startTime: moment(this.form.startTime).tz('Europe/London').format(),
        endTime: moment(this.form.endTime).tz('Europe/London').format(),
        imageUrls: this.form.imageUrl ? [this.form.imageUrl] : []
      });
    },
    async fetchWorkouts() {
      try {
        const response = await WorkoutService.search('', 0, 100);
        this.workouts = response.content || [];
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      }
    }
  },
  async created() {
    await this.fetchWorkouts();
  }
};
</script>