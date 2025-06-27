<template>
  <div class="ml-64 p-6">
    <h2 class="text-xl font-bold text-primary mb-4">
      {{ isEdit ? 'Edit' : 'New' }} Membership
    </h2>
    <form @submit.prevent="submitMembership" class="bg-white p-6 rounded shadow-md space-y-4">
      <div>
        <label class="block text-gray-700">Name</label>
        <input v-model="form.name" class="w-full p-2 border rounded" required />
      </div>
      <div>
        <label class="block text-gray-700">Price</label>
        <input v-model.number="form.price" type="number" step="0.01" class="w-full p-2 border rounded" required />
      </div>
      <div>
        <label class="block text-gray-700">Duration (days)</label>
        <input v-model.number="form.durationInDays" type="number" class="w-full p-2 border rounded" required />
      </div>
      <button type="submit" class="bg-accent text-white py-2 px-4 rounded hover:bg-green-700">
        Save Membership
      </button>
    </form>
  </div>
</template>

<script>
import MembershipService from '@/services/memberships.js';

export default {
  props: { membership: { type:Object, default:null } },
  data() {
    return { form: { name:'', price:null, durationInDays:null } };
  },
  computed: { isEdit() { return !!this.membership; } },
  created() {
    if (this.isEdit) this.form = { ...this.membership };
  },
  methods: {
    async submitMembership() {
      try {
        if (this.isEdit) {
          await MembershipService.update(this.membership.id, this.form);
          this.$toast.open({ message:'Membership updated', type:'success' });
        } else {
          await MembershipService.create(this.form);
          this.$toast.open({ message:'Membership created', type:'success' });
        }
        this.$emit('saved');
      } catch {
        this.$toast.open({ message:'Save failed', type:'error' });
      }
    }
  }
};
</script>
