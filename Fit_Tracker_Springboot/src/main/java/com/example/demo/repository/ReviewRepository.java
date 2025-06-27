package com.example.demo.repository;

import com.example.demo.model.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByWorkoutId(Long workoutId, Pageable pageable);
    Page<Review> findByUserId(Long userId, Pageable pageable);
}