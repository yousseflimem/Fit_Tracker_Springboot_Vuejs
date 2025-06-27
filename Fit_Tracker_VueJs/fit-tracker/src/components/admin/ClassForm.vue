<template>
  <form @submit.prevent="submit" class="grid grid-cols-2 gap-4">
    <!-- Left column -->
    <div class="space-y-4">
      <!-- Title -->
      <div>
        <label for="title" class="block text-gray-700">Title *</label>
        <input
            v-model="form.title"
            id="title"
            class="w-full p-2 border rounded"
            required
        />
        <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
      </div>

      <!-- Category -->
      <div>
        <label for="category" class="block text-gray-700">Category</label>
        <input
            v-model="form.category"
            id="category"
            class="w-full p-2 border rounded"
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-gray-700">Description</label>
        <textarea
            v-model="form.description"
            id="description"
            class="w-full p-2 border rounded"
            rows="4"
        ></textarea>
      </div>

      <!-- Coach select -->
      <div>
        <label for="coach" class="block text-gray-700">Coach *</label>
        <select
            v-model.number="form.coachId"
            id="coach"
            class="w-full p-2 border rounded"
            required
        >
          <option value="" disabled>Select a coach</option>
          <option
              v-for="c in coaches"
              :key="c.id"
              :value="c.id"
          >
            {{ c.username }} ({{ c.email }})
          </option>
        </select>
        <p v-if="errors.coachId" class="text-red-500 text-sm">{{ errors.coachId }}</p>
      </div>
      <!-- Start Time -->
      <div>
        <label for="startTime" class="block text-gray-700">Start Time *</label>
        <input
            v-model="form.startTime"
            type="datetime-local"
            id="startTime"
            class="w-full p-2 border rounded"
            :min="minDateTime"
            required
        />
        <p v-if="errors.startTime" class="text-red-500 text-sm">{{ errors.startTime }}</p>
      </div>

      <!-- End Time -->
      <div>
        <label for="endTime" class="block text-gray-700">End Time *</label>
        <input
            v-model="form.endTime"
            type="datetime-local"
            id="endTime"
            class="w-full p-2 border rounded"
            :min="minDateTime"
            required
        />
        <p v-if="errors.endTime" class="text-red-500 text-sm">{{ errors.endTime }}</p>
      </div>

    </div>

    <!-- Right column -->
    <div class="space-y-4">

      <!-- Images (up to 5) -->
      <div>
        <label class="block text-gray-700 mb-1">Images</label>
        <div
            v-for="(url, idx) in form.imageUrls"
            :key="idx"
            class="mb-2"
        >
          <input
              v-model="form.imageUrls[idx]"
              type="url"
              placeholder="https://example.com/img.jpg"
              class="w-full p-2 border rounded"
          />
        </div>
      </div>


      <!-- Capacity -->
      <div>
        <label for="capacity" class="block text-gray-700">Capacity *</label>
        <input
            v-model.number="form.capacity"
            type="number"
            id="capacity"
            class="w-full p-2 border rounded"
            min="0"
            required
        />
        <p v-if="errors.capacity" class="text-red-500 text-sm">{{ errors.capacity }}</p>
      </div>

      <!-- Workouts multi-select -->
      <div>
        <label class="block text-gray-700 mb-1">Workouts *</label>
        <select
            v-model="form.workoutIds"
            multiple
            class="w-full p-2 border rounded h-40"
            required
        >
          <option
              v-for="w in allWorkouts"
              :key="w.id"
              :value="w.id"
          >
            {{ w.name }} ({{ w.category }})
          </option>
        </select>
        <p v-if="errors.workoutIds" class="text-red-500 text-sm">{{ errors.workoutIds }}</p>
      </div>
    </div>

    <!-- Buttons span both columns -->
    <div class="col-span-2 flex justify-end space-x-2 mt-4">
      <button
          v-if="isEditMode"
          type="button"
          @click="$emit('cancel')"
          class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
      >
        Cancel
      </button>
      <button
          type="submit"
          class="bg-accent text-white py-2 px-4 rounded hover:bg-green-700"
          :disabled="hasErrors"
      >
        {{ isEditMode ? 'Update' : 'Create' }} Class
      </button>
    </div>
  </form>
</template>

<script>
import ClassService from '@/services/classes.js';
import WorkoutService from '@/services/workouts.js';
import UserService from '@/services/users.js';
import { mapGetters } from 'vuex';

export default {
  props: {
    classData: Object
  },
  data() {
    return {
      coaches: [],
      allWorkouts: [],
      form: {
        title: '',
        category: '',
        description: '',
        startTime: '',
        endTime: '',
        capacity: 0,
        coachId: null,
        imageUrls: Array(5).fill(''),
        workoutIds: []
      },
      errors: {
        title: '',
        startTime: '',
        endTime: '',
        capacity: '',
        coachId: '',
        workoutIds: ''
      }
    };
  },
  computed: {
    ...mapGetters(['userRole']),
    isEditMode() {
      return !!this.classData;
    },
    hasErrors() {
      return Object.values(this.errors).some(e => e);
    },
    minDateTime() {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      return now.toISOString().slice(0, 16);
    }
  },
  created() {
    this.loadCoachesAndWorkouts();
  },
  watch: {
    classData: {
      immediate: true,
      handler(data) {
        this.resetForm(data);
      }
    }
  },
  methods: {
    async loadCoachesAndWorkouts() {
      try {
        this.coaches = await UserService.getCoaches();
      } catch {
        this.$toast.error('Failed to load coaches');
      }
      try {
        const page = await WorkoutService.search({ page: 0, size: 100 });
        this.allWorkouts = page.content;
      } catch {
        this.$toast.error('Failed to load workouts');
      }
    },
    resetForm(data) {
      if (!data) {
        // Reset to blank form
        this.form = {
          title: '',
          category: '',
          description: '',
          startTime: '',
          endTime: '',
          capacity: 0,
          coachId: null,
          imageUrls: Array(5).fill(''),
          workoutIds: []
        };
      } else {
        // Fill form with classData
        this.form.title = data.title;
        this.form.category = data.category;
        this.form.description = data.description;
        this.form.startTime = data.startTime.slice(0, 16);
        this.form.endTime = data.endTime.slice(0, 16);
        this.form.capacity = data.capacity;
        this.form.coachId = data.coachId;
        this.form.imageUrls = [...data.imageUrls, ...Array(5 - data.imageUrls.length).fill('')];
        this.form.workoutIds = [...data.workoutIds];
      }
    },
    validate() {
      this.errors = {
        title: '',
        startTime: '',
        endTime: '',
        capacity: '',
        coachId: '',
        workoutIds: ''
      };

      let ok = true;
      const now = new Date();
      const start = new Date(this.form.startTime);
      const end = new Date(this.form.endTime);

      if (!this.form.title) {
        this.errors.title = 'Required';
        ok = false;
      }
      if (!this.form.startTime || start <= now) {
        this.errors.startTime = 'Must be in the future';
        ok = false;
      }
      if (!this.form.endTime || end <= start) {
        this.errors.endTime = 'Must be after start';
        ok = false;
      }
      if (this.form.capacity < 0) {
        this.errors.capacity = 'Must be >= 0';
        ok = false;
      }
      if (!this.form.coachId) {
        this.errors.coachId = 'Select a coach';
        ok = false;
      }
      if (!this.form.workoutIds.length) {
        this.errors.workoutIds = 'Pick at least one';
        ok = false;
      }

      return ok;
    },
    async submit() {
      if (!this.validate()) {
        this.$toast.error('Fix errors');
        return;
      }

      const payload = {
        ...this.form,
        startTime: new Date(this.form.startTime).toISOString(),
        endTime: new Date(this.form.endTime).toISOString(),
        imageUrls: this.form.imageUrls.filter(u => u),
        workoutIds: [...this.form.workoutIds]
      };

      try {
        if (this.isEditMode) {
          await ClassService.update(this.classData.id, payload);
          this.$emit('class-updated');
          this.$toast.success('Updated');
        } else {
          await ClassService.create(payload);
          this.$emit('class-created');
          this.$toast.success('Created');
        }
      } catch (e) {
        this.$toast.error(e.response?.data?.message || 'Save failed');
      }
    }
  }
};
</script>
