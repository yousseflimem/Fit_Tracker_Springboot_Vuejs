<template>
  <div class="ml-64 p-6">
    <h2 class="text-xl font-bold text-primary mb-4">
      {{ isEdit ? 'Edit' : 'New' }} Workout
    </h2>

    <form @submit.prevent="submitWorkout" class="space-y-4 bg-white p-6 rounded shadow-md">
      <!-- Name -->
      <div>
        <label class="block text-gray-700">Name</label>
        <input
            v-model="form.name"
            class="w-full p-2 border rounded"
            required
        />
      </div>

      <!-- Category -->
      <div>
        <label class="block text-gray-700">Category</label>
        <input
            v-model="form.category"
            class="w-full p-2 border rounded"
            required
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-gray-700">Description</label>
        <textarea
            v-model="form.description"
            class="w-full p-2 border rounded"
            required
        ></textarea>
      </div>

      <!-- Duration -->
      <div>
        <label class="block text-gray-700">Duration (min)</label>
        <input
            v-model.number="form.durationInMinutes"
            type="number"
            class="w-full p-2 border rounded"
            required
        />
      </div>

      <!-- Coach selector -->
      <div>
        <label class="block text-gray-700">Coach</label>
        <select
            v-model.number="form.coachId"
            class="w-full p-2 border rounded"
            required
        >
          <option disabled value="">— select a coach —</option>
          <option
              v-for="coach in coaches"
              :key="coach.id"
              :value="coach.id"
          >
            {{ coach.username }} ({{ coach.email }})
          </option>
        </select>
      </div>

      <!-- Images (up to 5) -->
      <div>
        <label class="block text-gray-700">Image URLs</label>
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

      <!-- Actions -->
      <div class="flex space-x-4">
        <button
            type="submit"
            class="bg-accent text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Save Workout
        </button>
        <button
            type="button"
            @click="$emit('cancel')"
            class="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import WorkoutService from '@/services/workouts.js';
import UserService    from '@/services/users.js';

export default {
  props: {
    workout: { type: Object, default: null }
  },

  data() {
    return {
      coaches: [],
      form: {
        name: '',
        category: '',
        description: '',
        durationInMinutes: null,
        coachId: '',
        imageUrls: Array(5).fill('')
      }
    };
  },

  computed: {
    isEdit() {
      return Boolean(this.workout);
    }
  },

  async created() {
    // 1) Load the list of coaches
    try {
      this.coaches = await UserService.getCoaches();
    } catch {
      this.$toast.error('Could not load coaches');
    }

    // 2) If editing, prefill form values
    if (this.isEdit) {
      const w = this.workout;
      this.form = {
        name: w.name,
        category: w.category,
        description: w.description,
        durationInMinutes: w.durationInMinutes,
        coachId: w.coachId,
        imageUrls: Array(5).fill('').map((_, i) => w.imageUrls?.[i] || '')
      };
    }
  },

  methods: {
    async submitWorkout() {
      try {
        // build payload
        const payload = {
          name: this.form.name,
          category: this.form.category,
          description: this.form.description,
          durationInMinutes: this.form.durationInMinutes,
          coachId: this.form.coachId,
          imageUrls: this.form.imageUrls.filter(u => u.trim())
        };

        if (this.isEdit) {
          await WorkoutService.update(this.workout.id, payload);
          this.$toast.success('Workout updated');
        } else {
          await WorkoutService.create(payload);
          this.$toast.success('Workout created');
        }

        this.$emit('submitted');
      } catch (err) {
        this.$toast.error(err.response?.data?.message || 'Save failed');
      }
    }
  }
};
</script>
