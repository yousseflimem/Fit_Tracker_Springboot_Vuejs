package com.example.demo.dto.request;

import jakarta.validation.constraints.*;

public record ReviewRequest(
        @NotNull(message = "Workout ID is required") Long workoutId,
        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5") Integer rating,
        @Size(max = 500, message = "Comment must be at most 500 characters") String comment
) {}