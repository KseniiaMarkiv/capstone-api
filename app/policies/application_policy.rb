# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  class Scope
    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      raise NotImplementedError, "You must define #resolve in #{self.class}"
    end
    def user_criteria
      user_id = @user.id.to_i if @user     #to_i assists in avoiding SQL injection
      user_id ? "=#{user_id}" : "is null"
    end
    
  def self.merge(scope)
    prev=nil
    scope.select { |r| 
      if prev && prev.id == r.id
        prev.user_roles << r.role_name if r.role_name
        false #toss this
      else 
        r.user_roles << r.role_name if r.role_name
        prev = r
      end
    }
  end

    private

    attr_reader :user, :scope
  end
end
