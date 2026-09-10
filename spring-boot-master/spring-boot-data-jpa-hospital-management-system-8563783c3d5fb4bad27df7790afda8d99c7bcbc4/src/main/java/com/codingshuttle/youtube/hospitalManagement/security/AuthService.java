package com.codingshuttle.youtube.hospitalManagement.security;

import com.codingshuttle.youtube.hospitalManagement.config.AuthProviderType;
import com.codingshuttle.youtube.hospitalManagement.dto.LoginRequestDto;
import com.codingshuttle.youtube.hospitalManagement.dto.LoginResponseDto;
import com.codingshuttle.youtube.hospitalManagement.dto.SignupResponseDto;
import com.codingshuttle.youtube.hospitalManagement.entity.User;
import com.codingshuttle.youtube.hospitalManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword())
        );
        User user = (User) authentication.getPrincipal();

        String token = authUtil.generateAccessToken(user);

        return new LoginResponseDto(token, user.getId());

    };

    public SignupResponseDto signup(LoginRequestDto signupRequestDto) {
       User user = userRepository.findByUsername(signupRequestDto.getUsername()).orElse(null);
       if(user != null) throw new IllegalArgumentException("User Already Exist");
       user = userRepository.save(User.builder()
               .username(signupRequestDto.getUsername())
               .password(passwordEncoder.encode( signupRequestDto.getPassword()))
               .build()
       );
       return new SignupResponseDto(user.getId(), user.getUsername());
    }


    public ResponseEntity<LoginResponseDto> handleOAuth2LoginRequest(OAuth2User oAuth2User, String registrationId) {
        // fetch providerType and providerId
        AuthProviderType providerType = authUtil.getProviderTypeFromRegistrationId(registrationId);
        // save the providerType and provider id info with user
        String providerId = authUtil.determineProviderIdFromOAuth2User(oAuth2User,registrationId);
        // if the user has an account: directly login

        User user = userRepository.findByProviderIdAndProviderType(providerId, providerType).orElse(null);

        String email = oAuth2User.getAttribute("email");

        User useEmail = userRepository.findByUsername(email).orElse(null);

        if(user != null && useEmail==null){
            String username = authUtil.determineUsernameFromOAuth2User(oAuth2User,providerId,registrationId);
        SignupResponseDto signupResponseDto = signup(new LoginRequestDto(username,null));
        }        // otherwise firest signup and login


    }
}
