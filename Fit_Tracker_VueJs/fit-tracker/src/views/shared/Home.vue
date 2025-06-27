<template>
  <div class="min-h-screen bg-gray-50">


    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-float">
            Transform Your
            <span class="relative">
              Fitness
              <div class="absolute bottom-0 left-0 w-full h-2 bg-primary/20 -rotate-1"></div>
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            Smart workouts, personalized plans, and community support to help you reach your goals
          </p>
          <div class="flex justify-center space-x-4">
            <button
                class="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
            <button class="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
              <span>How It Works</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-12 gap-8">
          <div class="md:col-span-4">
            <div class="sticky top-32">
              <h2 class="text-3xl font-bold mb-4">Why Choose Us</h2>
              <p class="text-gray-600">Experience fitness transformed through technology and expertise</p>
            </div>
          </div>
          <div class="md:col-span-8">
            <div class="grid gap-6">
              <div v-for="(feature, index) in features" :key="index"
                   class="p-8 border rounded-2xl hover:border-primary transition-all group hover:shadow-lg">
                <div class="flex items-start space-x-6">
                  <div class="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <!-- SVG paths based on feature.icon -->
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
                    <p class="text-gray-600">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workouts Section -->
    <div class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12">
          <div class="mb-6 md:mb-0">
            <h2 class="text-3xl font-bold mb-2">Featured Workouts</h2>
            <p class="text-gray-600">Curated programs for all fitness levels</p>
          </div>
          <div class="flex space-x-4">
            <button class="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              ←
            </button>
            <button class="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              →
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <WorkoutCard
              v-for="w in workouts"
              :key="w.id"
              :workout="w"
              class="hover:shadow-lg transition-shadow duration-300"
          />
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="py-16 bg-primary text-white">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div class="p-6">
            <div class="text-4xl font-bold mb-2">50k+</div>
            <div class="text-gray-200">Active Members</div>
          </div>
          <div class="p-6 border-x border-white/20">
            <div class="text-4xl font-bold mb-2">500+</div>
            <div class="text-gray-200">Workout Programs</div>
          </div>
          <div class="p-6">
            <div class="text-4xl font-bold mb-2">98%</div>
            <div class="text-gray-200">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WorkoutCard from '@/components/shared/WorkoutCard.vue';
import WorkoutService from '@/services/workouts.js';

export default {
  components: {WorkoutCard},
  data() {
    return {
      workouts: [],
      navigation: ['Programs', 'Workouts', 'Coaching', 'Community', 'About'],
      features: [
        {
          title: "AI-Powered Plans",
          description: "Custom workout plans that adapt to your progress"
        },
        {
          title: "Expert Coaching",
          description: "1-on-1 guidance from certified trainers"
        },
        {
          title: "Progress Tracking",
          description: "Detailed analytics and milestone tracking"
        }
      ]
    };
  },
  async created() {
    try {
      const resp = await WorkoutService.search({keyword: '', page: 0, size: 8});
      this.workouts = resp.content;
    } catch {
      this.$toast.open({message: 'Failed to load workouts', type: 'error'});
    }
  }
};
</script>

<style>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>