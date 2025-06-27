package com.example.demo.dto.request;

import com.example.demo.model.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserDto {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6)
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    //private Long membershipId;

    @Pattern(regexp = "^(https?://.*\\.(?:png|jpg|jpeg|gif))?$",
            message = "Profile image URL must be a valid image URL or empty")
    private String profileImageUrl="";
}